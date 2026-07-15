# Legal Assistant RAG Bot

Constitution and Legal Assistance chatbot using Retrieval-Augmented Generation (RAG) with advanced hybrid search.

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Groq API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Hashir-Ali-Shah/legal_assistant.git
cd legal_assistant
```

2. Install dependencies using `uv`:
```bash
pip install uv
uv sync
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

4. Run the backend server:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Features

- **Hybrid RAG Search** - Combines vector search, BM25, and cross-encoder reranking
- **Streaming Responses** - Real-time token-by-token generation
- **Session Management** - Conversation history per user
- **Multi-format Documents** - Supports PDF, DOCX, TXT
- **Voice Input** - Whisper-based speech-to-text
- **FastAPI Backend** - High-performance async API

## 🔧 Technology Stack

- **LLM:** Groq API (`openai/gpt-oss-20b`)
- **Embeddings:** HuggingFace `sentence-transformers/all-MiniLM-L6-v2`
- **Vector Store:** FAISS
- **Framework:** LangChain, FastAPI
- **Voice:** OpenAI Whisper

## 📖 Documentation

For detailed documentation, see [docs/project_overview.md](docs/project_overview.md)

## 🌐 API Endpoints

- `POST /chat` - Chat endpoint with streaming responses
- `WS /voice` - WebSocket endpoint for voice input

## 📝 Project Structure

```
legal_assistant/
├── backend/                 # Backend application
│   ├── main.py             # FastAPI application
│   ├── ChatBot.py          # Main chatbot orchestration
│   ├── Rag.py              # RAG pipeline with hybrid search
│   ├── DocReader.py        # Document processing
│   ├── Prompts.py          # Prompt templates
│   ├── Tools.py            # LangChain tools
│   ├── SessionManager.py   # Session management
│   ├── History.py          # Conversation history
│   ├── Streaming.py        # Streaming handler
│   └── VoiceAgent.py       # Voice transcription
├── docs/                    # Documentation and diagrams
│   ├── project_overview.md # Comprehensive project documentation
│   ├── flowchart.jpg       # System flowchart
│   ├── softarch.drawio.png # Software architecture diagram
│   ├── Constitution and Legal Assistance RAG Bot - FYP Report.pdf
│   ├── complete_proposal.pdf
│   └── (other documentation files)
├── tests/                   # Test files
│   ├── test.py
│   └── test2.py
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── pyproject.toml          # Dependencies
└── uv.lock                 # Lock file
```

## 🔐 Configuration

Create a `.env` file with:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com/

## 📄 License

Final Year Project - Constitution and Legal Assistance RAG Bot

## 👥 Author

Hashir Ali Shah
