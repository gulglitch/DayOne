# Day One - AI Startup Validator

**Built for AI Factory - Native.builder Hackathon via lablab.ai**

An AI-powered platform that validates startup ideas through a simulation of 6 C-suite executives arguing, challenging, and collaborating in real-time. Watch as Research, Product, Finance, Legal, Marketing, and CEO agents debate your idea and produce a comprehensive company dossier.

## 🎯 Architecture

- **Frontend**: Built with native.builder
- **Backend**: FastAPI (Python) with 6 specialized AI agents
- **Backend Deployment**: https://dayone-sxkq.onrender.com
- **Real-time Communication**: WebSockets for live agent updates

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

### Backend (Already Deployed)

The backend is live at: **https://dayone-sxkq.onrender.com**

Test it:
```bash
curl https://dayone-sxkq.onrender.com/health
```

### Local Development

```bash
cd backend
pip install -r requirements.txt

# Add your AI/ML API key to .env
echo "AIMLAPI_KEY=your_key_here" > .env
echo "MODEL_NAME=gpt-4o-mini" >> .env

# Run the server
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for API documentation.

### Test the API

```bash
# Start an analysis
curl -X POST https://dayone-sxkq.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI-powered meal planning app for busy professionals"}'

# Get the session_id from response, then check results
curl https://dayone-sxkq.onrender.com/api/result/{session_id}
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

## 🎬 Status

- [x] Backend implemented with 6 specialized agents
- [x] Sequential pipeline with adversarial challenges
- [x] WebSocket real-time streaming
- [x] Deployed on Render.com
- [x] Frontend built with native.builder
- [ ] Hackathon submission in progress

## 📚 Integration Documentation

See `.kiro/steering/` for complete integration guides:
- `api-reference.md` - Complete API documentation
- `integration.md` - Native.builder integration guide
- `demo.md` - Video demo guidelines
- `submission.md` - Hackathon submission checklist

## 🔗 Related Repositories

- **Original Next.js Frontend** (archived): [DayOne-NextJS-Frontend](../DayOne-NextJS-Frontend) - Original implementation before hackathon

## 📝 Documentation

See `/docs` for detailed implementation plans and PRD.
