"""
Voice URL patterns.
"""
from django.urls import path
from api.views.voice import transcribe_endpoint

urlpatterns = [
    path("transcribe/", transcribe_endpoint, name="voice-transcribe"),
]
