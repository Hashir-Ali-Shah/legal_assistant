"""
Voice views - Handles voice transcription.

Architecture:
- VoiceAgent is a singleton to avoid reloading Whisper on every request.
- /api/voice/transcribe/ — transcribes audio and returns JSON {transcription: str}
  The frontend then feeds this text into the normal chat pipeline.
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from api.utils.jwt_utils import get_user_from_request

# Singleton VoiceAgent — loaded once, reused across all requests
_voice_agent_instance = None


def _get_voice_agent():
    """Lazy-load VoiceAgent singleton. Returns None if faster-whisper is unavailable."""
    global _voice_agent_instance
    if _voice_agent_instance is None:
        try:
            from core.agents.VoiceAgent import VoiceAgent, WHISPER_AVAILABLE
            if not WHISPER_AVAILABLE:
                print("[Voice] faster-whisper not installed. Voice transcription unavailable.")
                return None
            _voice_agent_instance = VoiceAgent(model_name="base", device="cpu")
            print("[Voice] VoiceAgent singleton initialized.")
        except Exception as e:
            print(f"[Voice] Failed to initialize VoiceAgent: {e}")
            return None
    return _voice_agent_instance


@csrf_exempt
@require_http_methods(["POST"])
def transcribe_endpoint(request):
    """
    POST /api/voice/transcribe/
    Accepts: multipart/form-data with 'audio' file and optional 'session_id'.
    Returns: JSON { transcription: str } or { error: str }

    The transcription text is returned to the frontend, which feeds it directly
    into the normal chat pipeline via handleSendMessage. This keeps voice as a
    thin input layer — not a parallel chat system.
    """
    user = get_user_from_request(request)

    audio = request.FILES.get("audio")
    session_id = request.POST.get("session_id", "anonymous")

    print(f"[Voice] Transcription request from user: {user}, session: {session_id}")

    if not audio:
        return JsonResponse({"error": "No audio file provided."}, status=400)

    agent = _get_voice_agent()
    if agent is None:
        return JsonResponse(
            {"error": "Voice transcription is unavailable. The faster-whisper library is not installed."},
            status=503
        )

    try:
        audio_bytes = audio.read()
        print(f"[Voice] Received {len(audio_bytes)} bytes of audio")

        if len(audio_bytes) < 1000:
            return JsonResponse({"error": "Audio too short. Please try again."}, status=400)

        transcription = agent.transcribe_bytes(audio_bytes)
        print(f"[Voice] Transcription: '{transcription}'")

        if not transcription or not transcription.strip():
            return JsonResponse({"transcription": "", "message": "No speech detected."})

        return JsonResponse({"transcription": transcription.strip()})

    except Exception as e:
        print(f"[Voice] Transcription error: {e}")
        return JsonResponse({"error": "Transcription failed. Please try again."}, status=500)
