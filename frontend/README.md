# Lawbot Frontend

React-based frontend for the Lawbot legal assistance application.

## Features

- 🤖 AI-powered chat interface with streaming responses
- 🎤 Voice input using WebSocket and Whisper transcription
- 📄 Document upload and analysis (PDF, DOCX, TXT)
- 💬 Chat history management
- 🔐 Client-side authentication
- 📱 Fully responsive design
- ⚡ Built with Vite for fast development

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Router** - Navigation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URLs:
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── auth/        # Authentication components
│   ├── chat/        # Chat-related components
│   ├── common/      # Common UI components
│   └── layout/      # Layout components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API and WebSocket services
├── styles/          # Global styles
├── utils/           # Utility functions
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Available Pages

- `/` - Home/Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - User dashboard (protected)
- `/chat` - Main chat interface (protected)
- `/history` - Chat history (protected)
- `/documents` - Document management (protected)
- `/profile` - User profile (protected)
- `/about` - About page
- `/help` - Help/FAQ page
- `/resources` - Legal resources
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/disclaimer` - Legal disclaimer

## Backend Integration

The frontend expects the backend API to be running on `http://localhost:8000` by default.

Key endpoints used:
- `POST /chat` - Send messages with streaming responses
- `WS /voice` - Voice input via WebSocket

## License

MIT
