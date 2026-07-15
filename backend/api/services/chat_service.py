"""
Chat Service - Business logic for chat functionality.
Handles chatbot management, response generation, and file processing.
"""
import asyncio
import threading
from asgiref.sync import sync_to_async
from typing import Optional

from core.agents.ChatBot import ChatBot
from core.services.ChatPersistence import ChatPersistenceService
from core.services.SessionManager import SessionMemoryManager
from core.services.token_service import TokenTrackingService
from database.models import ChatSession


# In-memory chatbot cache (per session_id)
# redis will be implemented later for faster caching
chatbot_cache = {}

# Token estimation: ~4 characters per token (rough average for English)
CHARS_PER_TOKEN = 4


def estimate_tokens(text: str) -> int:
    """Estimate token count from text length."""
    return max(1, len(text) // CHARS_PER_TOKEN)


async def _title_gen_coroutine(session_id: str, first_message: str) -> None:
    """Async coroutine that calls Gemini and writes the title to the DB."""
    import os
    try:
        from langchain_groq import ChatGroq
        from django.db import connection
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            groq_api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.3,
        )
        prompt = (
            f"Generate a concise 3-6 word title for a legal consultation that started with: "
            f"'{first_message[:200]}'. Reply with ONLY the title, no quotes, no punctuation."
        )
        result = await llm.ainvoke(prompt)
        title = result.content.strip()[:60]
        if title:
            # Use sync DB call in a thread-safe way
            await sync_to_async(ChatPersistenceService.update_session_title)(session_id, title)
            print(f"[TitleGen] Session {session_id} titled: '{title}'")
        connection.close()  # Release DB connection held by this thread
    except Exception as e:
        print(f"[TitleGen] Non-fatal title generation error: {e}")


def _run_title_gen_in_thread(session_id: str, first_message: str) -> None:
    """
    Runs title generation in a dedicated daemon thread with its own event loop.
    This survives Django's per-request event loop closure.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(_title_gen_coroutine(session_id, first_message))
    finally:
        loop.close()


def spawn_title_generation(session_id: str, first_message: str) -> None:
    """Fire-and-forget: spawn a background thread for title generation."""
    t = threading.Thread(
        target=_run_title_gen_in_thread,
        args=(session_id, first_message),
        daemon=True
    )
    t.start()



def get_or_create_chatbot(session_id: str) -> ChatBot:
    """
    Get existing ChatBot instance from cache or create a new one.
    Memory is automatically loaded from DB if available (via SessionMemoryManager).
    """
    if session_id not in chatbot_cache:
        print(f"[{session_id}] Creating new ChatBot instance")
        chatbot_cache[session_id] = ChatBot()
    else:
        print(f"[{session_id}] Using existing ChatBot instance")
    return chatbot_cache[session_id]


async def generate_response_with_persistence(
    chatbot: ChatBot, 
    session_id: str, 
    message: str,
    user=None
):
    """
    Generate streaming response from chatbot with message persistence.
    Saves user message before processing and assistant message after completion.
    """
    print(f"[{session_id}] Processing message for session_id: {session_id}")
    buffer = ['"', '-', '*', '—']
    flush = False
    max_retries = 3
    retry_delay = 10
    response_content = []  # Accumulate full response
    
    # Save user message to database (wrapped in sync_to_async)
    if user:
        await ChatPersistenceService.save_message_async(session_id, 'user', message)
        # Spawn AI title generation in a dedicated thread (survives request lifecycle)
        try:
            session = await sync_to_async(ChatSession.objects.get)(id=session_id)
            message_count = await sync_to_async(session.messages.count)()
            if message_count <= 1:
                spawn_title_generation(session_id, message)
                print(f"[TitleGen] Spawned title generation thread for session {session_id}")
        except Exception as e:
            print(f"[{session_id}] Title generation task error (non-fatal): {e}")


    for attempt in range(max_retries):
        try:
            async for token in chatbot.ask_stream(message, session_id=session_id, k=8):
                if token in buffer:
                    if flush:
                        flush = False
                        continue
                    else:
                        flush = True
                response_content.append(token)
                yield token
            
            print(f"[{session_id}] Response streaming completed successfully")
            
            # Save assistant message and memory to database (wrapped in sync_to_async)
            if user:
                full_response = ''.join(response_content)
                await ChatPersistenceService.save_message_async(session_id, 'assistant', full_response)
                # Persist memory state
                await SessionMemoryManager.save_session_async(session_id)
                
                # Track token usage
                try:
                    session = await sync_to_async(ChatSession.objects.get)(id=session_id)
                    input_tokens = estimate_tokens(message)
                    output_tokens = estimate_tokens(full_response)
                    
                    await TokenTrackingService.record_usage_async(
                        user=user,
                        session=session,
                        model_name="gemini-2.5-flash",
                        provider="google",
                        input_tokens=input_tokens,
                        output_tokens=output_tokens,
                        request_type="chat"
                    )
                except Exception as track_error:
                    print(f"[{session_id}] Token tracking error (non-fatal): {track_error}")
            
            return
        except Exception as e:
            error_str = str(e)
            if "ResourceExhausted" in error_str or "429" in error_str or "quota" in error_str.lower():
                if attempt < max_retries - 1:
                    wait_time = retry_delay * (2 ** attempt)
                    print(f"[{session_id}] Rate limit hit. Waiting {wait_time}s before retry {attempt + 2}/{max_retries}")
                    yield f"\n\n⏳ Rate limit reached. Retrying in {wait_time} seconds...\n\n"
                    await asyncio.sleep(wait_time)
                else:
                    print(f"[{session_id}] Rate limit: max retries exceeded")
                    yield "\n\n Rate limit exceeded. Please wait a minute and try again.\n"
                    return
            else:
                print(f"[{session_id}] Error: {e}")
                yield f"\n\nError: {str(e)}\n"
                return


async def generate_response(chatbot: ChatBot, chat_id: str, message: str):
    """
    Generate streaming response (legacy, no persistence).
    For backward compatibility with unauthenticated requests.
    """
    print(f"[{chat_id}] Processing message for chat_id: {chat_id}")
    buffer = ['"', '-', '*', '—']
    flush = False
    max_retries = 3
    retry_delay = 10

    for attempt in range(max_retries):
        try:
            async for token in chatbot.ask_stream(message, session_id=chat_id, k=8):
                if token in buffer:
                    if flush:
                        flush = False
                        continue
                    else:
                        flush = True
                yield token
            print(f"[{chat_id}] Response streaming completed successfully")
            return
        except Exception as e:
            error_str = str(e)
            if "ResourceExhausted" in error_str or "429" in error_str or "quota" in error_str.lower():
                if attempt < max_retries - 1:
                    wait_time = retry_delay * (2 ** attempt)
                    print(f"[{chat_id}] Rate limit hit. Waiting {wait_time}s before retry {attempt + 2}/{max_retries}")
                    yield f"\n\n⏳ Rate limit reached. Retrying in {wait_time} seconds...\n\n"
                    await asyncio.sleep(wait_time)
                else:
                    print(f"[{chat_id}] Rate limit: max retries exceeded")
                    yield "\n\n Rate limit exceeded. Please wait a minute and try again.\n"
                    return
            else:
                print(f"[{chat_id}] Error: {e}")
                yield f"\n\nError: {str(e)}\n"
                return


def file_processing(files, chatbot: ChatBot, chat_id: str):
    """
    Process uploaded files and add them to the chatbot context.
    """
    for file in files:
        if file.name:
            print(f"[{chat_id}] Processing file: {file.name}")
            try:
                chatbot.read(file, filename=file.name)
            except Exception as file_error:
                print(f"[{chat_id}] Error reading file {file.name}: {file_error}")
