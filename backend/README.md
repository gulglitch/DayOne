# Day One Backend

AI-powered startup validation platform with 6 specialized agents.

## Setup

1. Install Python 3.11+
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

4. Run the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Visit API docs at: http://localhost:8000/docs

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── models.py            # Pydantic models
│   ├── pipeline.py          # Agent orchestration
│   ├── agents/              # 6 specialized agents
│   ├── prompts/             # Agent prompts
│   └── storage/             # Session management
├── data/                    # SQLite database
└── requirements.txt
```

## API Endpoints

- `POST /api/analyze` - Start analysis
- `GET /api/result/{session_id}` - Get results
- `WS /ws/{session_id}` - Real-time updates
- `GET /health` - Health check
