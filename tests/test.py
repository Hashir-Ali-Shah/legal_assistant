from pathlib import Path
from VoiceAgent import VoiceAgent
# Load .wav file into bytes
with open("backend/test.wav", "rb") as f:
    audio_bytes = f.read()

# Pass to VoiceAgent
agent = VoiceAgent()
print("Transcription:", agent.transcribe_bytes(audio_bytes))
