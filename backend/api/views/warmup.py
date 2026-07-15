"""
Warmup View - Pre-initializes the ChatBot singleton on first page load.
This eliminates the cold-start delay (embedding model load + Pinecone connect)
that users would otherwise experience on their very first message.
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Flag so we only initialize once per server lifetime
_warmed_up = False


@csrf_exempt
@require_http_methods(["GET", "POST"])
def warmup_endpoint(request):
    """
    Called silently by the frontend when the chat window opens.
    Ensures the ChatBot singleton (embedding model + Pinecone) is loaded
    before the user sends their first message.
    """
    global _warmed_up

    if _warmed_up:
        return JsonResponse({"status": "ready", "cold_start": False})

    try:
        # Importing triggers the RAGPipeline and PineconeService singletons
        from api.services.chat_service import get_or_create_chatbot
        get_or_create_chatbot("__warmup__")
        _warmed_up = True
        print("[Warmup] ChatBot singleton initialized successfully.")
        return JsonResponse({"status": "ready", "cold_start": True})
    except Exception as e:
        print(f"[Warmup] Initialization error: {e}")
        return JsonResponse({"status": "error", "detail": str(e)}, status=500)
