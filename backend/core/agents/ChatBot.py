import os
from dotenv import load_dotenv
from pathlib import Path
import asyncio

# Load .env from backend folder
backend_dir = Path(__file__).resolve().parent.parent.parent
load_dotenv(backend_dir / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

from langchain_groq import ChatGroq
from langchain_core.runnables import ConfigurableFieldSpec, RunnableLambda, RunnablePassthrough
from langchain_core.runnables.history import RunnableWithMessageHistory
from langgraph.prebuilt import create_react_agent

from core.services.SessionManager import SessionMemoryManager
from core.services.Tools import MathTools
from core.utilities.Prompts import ChatBotPrompts
from core.agents.Rag import RAGPipeline
from core.utilities.Streaming import QueueCallbackHandler
from core.utilities.DocReader import DocumentReader


from typing import List, Optional, Union, BinaryIO, TextIO
from pathlib import Path



class ChatBot():
    def __init__(self, temperature: float = 0.7):
        self.document_reader = DocumentReader()
        self.session = SessionMemoryManager
        self.chat_prompt = ChatBotPrompts.build_prompt()
        self.rag_pipeline = RAGPipeline()
        
        self.tools = MathTools.get_tools() + [MathTools.get_retrieval_tool(self.rag_pipeline)]
        
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            groq_api_key=GROQ_API_KEY,
            temperature=temperature,
            streaming=True,
        )
        
        # Use LangGraph create_react_agent directly
        self.agent = create_react_agent(self.llm, tools=self.tools)
        
    async def _prepare_agent_inputs(self, query: str, session_id: str, k: int) -> tuple[dict, object]:
        memory = await self.session.get_session_async(session_id, k=k)
        prompt_value = self.chat_prompt.invoke({
            "question": query,
            "chat_history": memory.messages,
            "agent_scratchpad": [],
            "uploaded_docs": self.rag_pipeline.get_docs_data()
        })
        return {"messages": prompt_value.to_messages()}, memory
    
    def read(self, file_input: Union[str, BinaryIO, TextIO], 
            filename: Optional[str] = None) -> None:
        """Ingest document into RAG pipeline."""
        file_path = os.path.abspath(file_input) if isinstance(file_input, str) else file_input
        if isinstance(file_input,str):
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}") 
        if filename:
            self.rag_pipeline.set_docs_data(self.document_reader.read(file_input, filename))
        else:
            self.rag_pipeline.set_docs_data(self.document_reader.read(file_path))


    


    async def ask(self, query: str, session_id: str = "default", k: int = 4) -> str:
        """Send a query and return the final output."""
        input_state, memory = await self._prepare_agent_inputs(query, session_id, k)
        
        result = await self.agent.ainvoke(input_state)
        final_message = result["messages"][-1].content
        
        from langchain_core.messages import HumanMessage, AIMessage
        memory.add_message(HumanMessage(content=query))
        memory.add_message(AIMessage(content=final_message))
        await self.session.save_session_async(session_id)
        
        return final_message
    
    async def ask_stream(self, query: str, session_id: str = "default", k: int = 4):
        input_state, memory = await self._prepare_agent_inputs(query, session_id, k)
        
        full_response = ""
        try:
            async for event in self.agent.astream_events(
                input_state,
                version="v2"
            ):
                if event["event"] == "on_tool_start":
                    if event.get("name") == "search_legal_context":
                        yield "[__RETRIEVING__]"
                        await asyncio.sleep(0.4)
                    elif event.get("name") == "request_user_clarification":
                        import json
                        args = event.get("data", {}).get("input", {})
                        questions = args.get("questions", [])
                        payload = json.dumps(questions)
                        yield f"[__CLARIFICATION_FORM__]{payload}[__END_FORM__]"
                    elif event.get("name") == "generate_legal_document":
                        import json
                        args = event.get("data", {}).get("input", {})
                        payload = json.dumps(args)
                        yield f"[__DOCUMENT_DRAFT__]{payload}[__END_DRAFT__]"
                
                elif event["event"] == "on_tool_end":
                    if event.get("name") == "search_legal_context":
                        yield "[__PROCESSING__]"
                        await asyncio.sleep(0.4)
                        
                elif event["event"] == "on_chat_model_stream":
                    chunk = event["data"]["chunk"]
                    if chunk and chunk.content:
                        if isinstance(chunk.content, list):
                            # Gemini returns content as a list of content blocks (dicts with a 'text' key)
                            content = "".join(
                                item.get("text", "") if isinstance(item, dict) else str(item)
                                for item in chunk.content
                            )
                        else:
                            content = chunk.content
                        if content:
                            full_response += content
                            yield content

        except Exception as e:
            error_str = str(e)
            # Catch token/rate limit errors from any LLM provider and surface a clean message
            if "rate_limit" in error_str.lower() or "429" in error_str or "413" in error_str or "quota" in error_str.lower():
                print(f"[ChatBot] Rate limit hit: {error_str}")
                friendly = "I'm currently experiencing high demand and hit a rate limit. Please wait a moment and try again."
                full_response = friendly
                yield friendly
            else:
                print(f"[ChatBot] Streaming error: {error_str}")
                friendly = "I encountered an unexpected error while processing your request. Please try again."
                full_response = friendly
                yield friendly

        from langchain_core.messages import HumanMessage, AIMessage
        memory.add_message(HumanMessage(content=query))
        memory.add_message(AIMessage(content=full_response))
        await self.session.save_session_async(session_id)





if __name__ == "__main__":
    import asyncio

    
    async def test_streaming():
        bot = ChatBot()
        print("Streaming result:")
        async for token in bot.ask_stream("hello", session_id="test_session", k=3):
            print(token, end="", flush=True)
        print() 
    
    asyncio.run(test_streaming())


