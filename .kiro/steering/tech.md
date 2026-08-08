# Day One - Technical Stack

## Architecture

**Monorepo** with separate backend and frontend services communicating via REST API and WebSockets.

## Backend Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI (async/await throughout)
- **LLM Integration**: OpenAI SDK via AI/ML API endpoint (OpenRouter-compatible)
- **Data Models**: Pydantic v2 for validation and serialization
- **Session Storage**: In-memory dict with optional persistence (SQLite for future)
- **Real-time**: WebSockets for live agent updates

### Backend Dependencies

```
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
pydantic>=2.6.0
python-dotenv>=1.0.0
websockets>=12.0
aiosqlite>=0.19.0
requests>=2.31.0
openai>=1.12.0
```

### Backend Architecture Patterns

- **Base Agent Class**: All agents inherit from `BaseAgent` with shared LLM calling, JSON extraction, and fallback logic
- **Sequential Pipeline**: `CompanyPipeline` orchestrates agents in fixed order: Research → Product → Finance → Legal → Marketing → CEO
- **WebSocket Callbacks**: Pipeline emits events via callback function to send real-time updates
- **Resilient JSON Parsing**: Agents use `_call_json()` with fence stripping, validation, retry logic, and fallbacks
- **No External Dependencies**: Switched from LangChain to direct OpenAI SDK to avoid dependency issues

## Frontend Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Smooth Scroll**: Lenis
- **Fonts**: Self-hosted via Fontsource (Inter, Fraunces, IBM Plex Mono)

### Frontend Dependencies

Key packages: `next@16.3.0`, `react@19.2.8`, `framer-motion@^13.0.0`, `lenis@^1.3.26`, `tailwindcss@^4`

### Frontend Architecture Patterns

- **App Router**: File-based routing in `src/app/`
- **Custom Hook**: `useCompanyRun` handles WebSocket connection and result polling
- **Type Safety**: TypeScript types in `lib/types.ts` mirror backend Pydantic models
- **API Layer**: Centralized fetch helpers in `lib/api.ts` with env-based URL configuration

## Common Commands

### Backend

```bash
# Setup
cd backend
pip install -r requirements.txt

# Configure API key
# Edit .env and add: AIMLAPI_KEY=your_key_here

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Quick start (Windows)
start.bat

# Test API
python test_api.py

# API documentation
# Visit http://localhost:8000/docs
```

### Frontend

```bash
# Setup
cd Frontend
npm install

# Configure backend URL (optional)
# Create .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint
npm run lint
```

### Docker

```bash
# Run full stack
docker-compose up --build

# Backend only
docker-compose up backend

# Stop all
docker-compose down
```

## Environment Variables

### Backend (.env)
- `AIMLAPI_KEY` (required): API key for AI/ML API endpoint
- `MODEL_NAME` (optional): Model identifier, defaults to "openrouter/free"

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` (optional): Backend URL, defaults to "http://localhost:8000"

## API Endpoints

- `GET /` - Root info
- `GET /health` - Health check with session counts
- `POST /api/analyze` - Start analysis, returns session_id
- `WS /ws/{session_id}` - Real-time agent updates stream
- `GET /api/result/{session_id}` - Retrieve completed dossier
- `GET /api/sessions` - List all sessions

## Ports

- Backend: 8000
- Frontend: 3000
