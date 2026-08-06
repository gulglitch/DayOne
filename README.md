# Day One - AI Startup Validator

**Built for AI Factory Hackathon via LabLab.ai**

An AI-powered platform that validates startup ideas through a simulation of 6 C-suite executives arguing, challenging, and collaborating in real-time. Watch as Research, Product, Finance, Legal, Marketing, and CEO agents debate your idea and produce a comprehensive company dossier.

## 🎯 Core Concept

Submit a startup idea and watch 6 AI agents analyze it:
1. **Research Agent** 🔍 - Market analysis and competitor research
2. **Product Agent** 💡 - MVP definition and tech stack
3. **Finance Agent** 💰 - Revenue model and financial challenges
4. **Legal Agent** ⚖️ - Compliance and legal structure
5. **Marketing Agent** 📢 - Go-to-market strategy
6. **CEO Agent** 👔 - Final decisions and conflict resolution

The magic: Finance and Legal agents actively challenge the plan, and the CEO makes the final call.

## 🚀 Quick Start

### Get Your Free API Key

1. **Sign up at OpenRouter** (no credit card required): https://openrouter.ai/auth/signup
2. **Get your API key**: https://openrouter.ai/settings/keys
3. See detailed instructions: [GET_API_KEY.md](GET_API_KEY.md)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Add your API key to .env
echo "OPENROUTER_API_KEY=sk-or-v1-your_key_here" > .env

# Run the server
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for API documentation.

### Test the API

```bash
# Start an analysis
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI-powered meal planning app for busy professionals"}'

# Get the session_id from response, then check results
curl http://localhost:8000/api/result/{session_id}
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Data models
│   ├── pipeline.py          # Agent orchestration
│   └── agents/              # 6 specialized agents
│       ├── research.py
│       ├── product.py
│       ├── finance.py
│       ├── legal.py
│       ├── marketing.py
│       └── ceo.py
docs/
├── Day_One_PRD.pdf          # Original PRD
└── SIMPLIFIED_BACKEND_PLAN.md  # Implementation guide
```

## 🔑 API Endpoints

- `POST /api/analyze` - Start analysis with a startup idea
- `GET /api/result/{session_id}` - Retrieve completed dossier
- `WS /ws/{session_id}` - Real-time agent updates
- `GET /health` - Health check

## 🎬 Development Status

- [x] Backend setup complete
- [x] All 6 agents implemented
- [x] Sequential pipeline with challenges
- [x] WebSocket real-time streaming
- [ ] Frontend (coming soon)
- [ ] Deployment

## 📝 Documentation

See `/docs` for detailed implementation plans and PRD.
