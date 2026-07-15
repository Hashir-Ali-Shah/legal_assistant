"""
Chat URL patterns..

Endpoints:
- POST /api/chat/ - Send chat message
- GET /api/chat/sessions/ - List user's sessions
- POST /api/chat/sessions/ - Create new session
- GET /api/chat/sessions/{id}/ - Get session with messages
- DELETE /api/chat/sessions/{id}/ - Delete session
- PATCH /api/chat/sessions/{id}/ - Update session title
- GET /api/chat/warmup/ - Pre-initialize ChatBot (cold-start elimination)
"""
from django.urls import path
from api.views.chat import chat_endpoint
from api.views.sessions import sessions_list, session_detail
from api.views.warmup import warmup_endpoint

urlpatterns = [
    path("", chat_endpoint, name="chat"),
    path("sessions/", sessions_list, name="sessions_list"),
    path("sessions/<uuid:session_id>/", session_detail, name="session_detail"),
    path("warmup/", warmup_endpoint, name="warmup"),
]

