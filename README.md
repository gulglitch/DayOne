<div align="center">

# 🚀 Day One - AI Startup Validator

### Transform Rough Ideas into Validated Company Plans Through Adversarial AI Collaboration

[![Hackathon](https://img.shields.io/badge/Hackathon-AI%20Factory%20%7C%20Native.builder-blue?style=for-the-badge)](https://lablab.ai/ai-hackathons/nativebuilder-build-without-limits)
[![Platform](https://img.shields.io/badge/Platform-lablab.ai-orange?style=for-the-badge)](https://lablab.ai)
[![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)](https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/)
[![Backend](https://img.shields.io/badge/Backend-Live%20on%20Render-purple?style=for-the-badge)](https://dayone-sxkq.onrender.com)

[**Try It Live**](https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/) | [**API Docs**](https://dayone-sxkq.onrender.com/docs) | [**Video Demo**](#-demo-video) | [**Documentation**](#-documentation)

---

</div>

## 📖 Table of Contents

- [🎯 Problem & Solution](#-problem--solution)
- [✨ Key Features](#-key-features)
- [🎬 Demo Video](#-demo-video)
- [🏗️ Architecture](#️-architecture)
- [🤖 The AI Boardroom](#-the-ai-boardroom)
- [🚀 Try It Yourself](#-try-it-yourself)
- [⚙️ Local Development](#️-local-development)
- [🔌 API Reference](#-api-reference)
- [🛠️ Technology Stack](#️-technology-stack)
- [📊 Project Structure](#-project-structure)
- [🎯 Hackathon Submission](#-hackathon-submission)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Problem & Solution

### The Problem

**Startup validation is expensive, slow, and often biased.**

- Founders waste **months** and **thousands of dollars** before getting structured feedback
- Traditional consultants are expensive (€5,000-€50,000+ per project)
- Accelerators accept only 1-3% of applicants
- Peer feedback lacks domain expertise
- Solo founders miss critical blind spots

### Our Solution

**Day One provides instant, comprehensive startup validation through adversarial AI collaboration.**

Submit your rough idea and watch a virtual C-suite boardroom debate it in real-time. Six specialized AI agents—Research, Product, Finance, Legal, Marketing, and CEO—analyze, challenge, and refine your concept, delivering a professional company dossier in minutes.

**What used to take weeks now takes a coffee break. ☕**

---

## ✨ Key Features

### 🎭 Adversarial Validation (Not Just Consensus)
- **Finance & Legal agents actively challenge** proposals
- **CEO agent resolves conflicts** and makes final decisions
- Simulates real boardroom dynamics, not echo chambers

### ⚡ Real-Time Streaming Experience
- **WebSocket-powered live updates** show agents "thinking"
- Watch the debate unfold as agents collaborate and clash
- See challenges raised and resolutions made in real-time

### 📊 Comprehensive Dossier Output
Each analysis produces a detailed company dossier including:
- ✅ **Market Analysis** - Competitors, target audience, positioning
- ✅ **MVP Scope** - Core features and technical architecture
- ✅ **Revenue Model** - Monetization strategy and pricing
- ✅ **Legal Structure** - Entity type and compliance requirements
- ✅ **Marketing Strategy** - Go-to-market plan and target channels
- ✅ **Elevator Pitch** - Investor-ready 30-second summary

### 🎯 Target Users
- 🚀 **Aspiring Founders** - Validate ideas before investing time/money
- 🏢 **Startup Accelerators** - Rapid screening and feedback for applicants
- 💡 **Entrepreneurs** - Structured analysis for new ventures
- 🎓 **Students** - Learn startup fundamentals through AI mentorship

---

## 🎬 Demo Video

> **📹 Watch Day One in Action** *(3-minute demo)*

*[Demo video will be embedded here before final submission]*

**Demo Highlights:**
1. Submit a startup idea (e.g., "AI-powered meal planning app")
2. Watch 6 agents debate in real-time
3. See Finance challenge the revenue model
4. See Legal flag data privacy concerns
5. Watch CEO resolve conflicts
6. Receive comprehensive company dossier

---

## 🏗️ Architecture

Day One uses a modern, scalable architecture designed for real-time AI collaboration:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (native.builder)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Landing Page  │  Boardroom View  │  Dossier Display  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │   REST API + WebSocket    │
        └─────────────┬─────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│              BACKEND (FastAPI on Render.com)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               CompanyPipeline (Orchestrator)           │ │
│  └───┬────────────────────────────────────────────────────┘ │
│      │                                                        │
│  ┌───▼───────────────────────────────────────────────────┐  │
│  │  Agent Sequence (Sequential Execution)                │  │
│  │                                                        │  │
│  │  1️⃣ Research → 2️⃣ Product → 3️⃣ Finance (Challenge)    │  │
│  │  4️⃣ Legal (Challenge) → 5️⃣ Marketing → 6️⃣ CEO (Resolve) │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              AI/ML API (OpenAI Compatible)             │  │
│  │                   Model: gpt-4o-mini                   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Key Architectural Decisions:**
- **Sequential Agent Execution** - Ensures coherent analysis flow
- **WebSocket Streaming** - Real-time updates create engaging UX
- **Adversarial Pattern** - Finance/Legal challenge, CEO resolves
- **Stateless Backend** - Easy horizontal scaling
- **Direct OpenAI SDK** - No external dependencies (removed LangChain for stability)

---

## 🤖 The AI Boardroom

Meet the 6 specialized agents that analyze your startup idea:

### 1️⃣ Research Agent 🔍
**Role:** Chief Research Officer  
**Personality:** Analytical and data-driven  
**Responsibilities:**
- Market size and growth analysis
- Competitor landscape mapping
- Target audience definition
- Unique value proposition validation

### 2️⃣ Product Agent 💡
**Role:** Chief Product Officer  
**Personality:** Visionary and user-focused  
**Responsibilities:**
- MVP scope definition
- Core feature prioritization
- Technical architecture recommendations
- Tech stack selection

### 3️⃣ Finance Agent 💰
**Role:** Chief Financial Officer  
**Personality:** Skeptical and risk-aware  
**Responsibilities:**
- Revenue model design
- Pricing strategy
- **Challenges unrealistic financial assumptions**
- Raises concerns about monetization

### 4️⃣ Legal Agent ⚖️
**Role:** Chief Legal Officer  
**Personality:** Cautious and compliance-focused  
**Responsibilities:**
- Legal entity structure recommendation
- Compliance requirements identification
- **Challenges risky legal positions**
- Flags regulatory concerns

### 5️⃣ Marketing Agent 📢
**Role:** Chief Marketing Officer  
**Personality:** Creative and growth-oriented  
**Responsibilities:**
- Go-to-market strategy
- Target channel selection
- Brand positioning
- Customer acquisition approach

### 6️⃣ CEO Agent 👔
**Role:** Chief Executive Officer  
**Personality:** Decisive and strategic  
**Responsibilities:**
- Final decision-making
- **Resolves conflicts between agents**
- Synthesizes perspectives into coherent plan
- Crafts investor-ready elevator pitch

---

## 🚀 Try It Yourself

### 🌐 Live Application

**Frontend (native.builder):**  
👉 **[https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/](https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/)**

**Backend API:**  
👉 **[https://dayone-sxkq.onrender.com](https://dayone-sxkq.onrender.com)**  
👉 **[API Documentation](https://dayone-sxkq.onrender.com/docs)** (Interactive Swagger UI)

### 🧪 Quick Test (No Installation Required)

Test the backend directly via command line:

```bash
# Health check
curl https://dayone-sxkq.onrender.com/health

# Start an analysis
curl -X POST https://dayone-sxkq.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI-powered meal planning app that uses grocery receipts to suggest recipes"}'

# Response will include a session_id - use it to fetch results
curl https://dayone-sxkq.onrender.com/api/result/{session_id}
```

**⚠️ Note:** First request may take 30-60 seconds as the backend wakes up from Render's free tier sleep mode. Subsequent requests are fast!

---

## ⚙️ Local Development

Want to run Day One locally? Follow these steps:

### Prerequisites

- Python 3.11+ installed
- pip package manager
- AI/ML API key from [lablab.ai](https://lablab.ai/redeem-coupon/ai-ml-api-coupon-nativebuilder-hackathon)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/DayOne.git
cd DayOne/backend

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create a .env file with:
echo "AIMLAPI_KEY=your_key_here" > .env
echo "MODEL_NAME=gpt-4o-mini" >> .env

# Run the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:**
- API: `http://localhost:8000`
- Interactive Docs: `http://localhost:8000/docs`
- Alternative Docs: `http://localhost:8000/redoc`

### Frontend Integration

The frontend is built with **native.builder** and connects to the backend via:
- REST API for starting analysis and fetching results
- WebSocket for real-time agent message streaming

See [`.kiro/steering/integration.md`](.kiro/steering/integration.md) for complete integration guide.

### Docker Setup (Optional)

```bash
# Run entire stack with Docker Compose
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: Configure native.builder to use http://localhost:8000
```

---

## 🔌 API Reference

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check and active sessions |
| `POST` | `/api/analyze` | Start new analysis (returns session_id) |
| `GET` | `/api/result/{session_id}` | Fetch completed dossier |
| `WS` | `/ws/{session_id}` | Real-time agent updates stream |
| `GET` | `/api/sessions` | List all sessions |

### Example: Start Analysis

**Request:**
```bash
POST /api/analyze
Content-Type: application/json

{
  "idea": "Your startup idea here",
  "target_market": "Optional specific market"
}
```

**Response:**
```json
{
  "session_id": "22f2014f-fe3d-4596-9d99-d4e60a4354dd",
  "status": "started",
  "message": "Analysis started. Connect to WebSocket for real-time updates."
}
```

### Example: WebSocket Connection

```javascript
const ws = new WebSocket('wss://dayone-sxkq.onrender.com/ws/{session_id}');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`[${data.agent}] ${data.message}`);
  
  // Message types: info, challenge, resolution, error
  // Agents: research, product, finance, legal, marketing, ceo, system
};
```

### Example: Fetch Dossier

**Request:**
```bash
GET /api/result/{session_id}
```

**Response:** (when completed)
```json
{
  "session_id": "22f2014f-...",
  "status": "completed",
  "dossier": {
    "idea": "Original idea",
    "problem_statement": "...",
    "target_audience": "...",
    "competitors": ["Competitor 1", "Competitor 2"],
    "mvp_scope": ["Feature 1", "Feature 2"],
    "revenue_model": "...",
    "elevator_pitch": "..."
  }
}
```

**📖 Complete API Documentation:**  
See [`.kiro/steering/api-reference.md`](.kiro/steering/api-reference.md) for full TypeScript types, error handling, and integration examples.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** native.builder (React-based)
- **Styling:** Tailwind CSS
- **Real-time:** WebSocket client
- **Deployment:** NativelyAI Platform

### Backend
- **Language:** Python 3.11+
- **Framework:** FastAPI (async/await)
- **AI Integration:** OpenAI SDK via AI/ML API
- **Data Validation:** Pydantic v2
- **Real-time:** WebSockets
- **Deployment:** Render.com (HTTPS + WSS)

### AI Models
- **Primary Model:** `gpt-4o-mini` (fast, cost-effective)
- **Alternative Models:** `gpt-4o`, `claude-3-5-sonnet`
- **API Provider:** AI/ML API (OpenRouter-compatible)

### Infrastructure
- **Backend Hosting:** Render.com
- **Frontend Hosting:** NativelyAI Platform
- **Containerization:** Docker + docker-compose
- **API Protocol:** REST + WebSocket (WSS)

---

## 📊 Project Structure

```
DayOne/
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, endpoints
│   │   ├── models.py            # Pydantic data models
│   │   ├── pipeline.py          # Agent orchestration logic
│   │   ├── agents/              # 6 specialized AI agents
│   │   │   ├── base.py          # BaseAgent class with LLM logic
│   │   │   ├── research.py      # Research Agent
│   │   │   ├── product.py       # Product Agent
│   │   │   ├── finance.py       # Finance Agent (challenges)
│   │   │   ├── legal.py         # Legal Agent (challenges)
│   │   │   ├── marketing.py     # Marketing Agent
│   │   │   └── ceo.py           # CEO Agent (resolves)
│   │   ├── prompts/             # Agent prompt templates
│   │   └── storage/             # Session storage logic
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Docker configuration
│   └── test_api.py              # API integration tests
├── docs/
│   ├── Day_One_PRD.pdf          # Original Product Requirements
│   └── SIMPLIFIED_BACKEND_PLAN.md  # Implementation strategy
├── .kiro/
│   └── steering/                # Integration documentation
│       ├── api-reference.md     # Complete API docs
│       ├── integration.md       # Frontend integration guide
│       ├── demo.md              # Demo video guidelines
│       ├── submission.md        # Hackathon checklist
│       ├── product.md           # Product overview
│       └── tech.md              # Technical stack details
├── docker-compose.yml           # Multi-container setup
└── README.md                    # This file
```

---

## 🎯 Hackathon Submission

**Event:** AI Factory - Native.builder Hackathon  
**Platform:** [lablab.ai](https://lablab.ai/ai-hackathons/nativebuilder-build-without-limits)  
**Dates:** August 3–10, 2026  
**Status:** 🚧 In Progress

### Submission Deliverables

- ✅ **Live Application:** [https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/](https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/)
- ✅ **Backend API:** [https://dayone-sxkq.onrender.com](https://dayone-sxkq.onrender.com)
- ✅ **API Documentation:** [https://dayone-sxkq.onrender.com/docs](https://dayone-sxkq.onrender.com/docs)
- 🚧 **Demo Video:** (3-minute end-to-end workflow) - *In Production*
- ✅ **Source Code:** This repository
- ✅ **Documentation:** Complete integration guides in `.kiro/steering/`

### What Makes Day One Special

1. **Adversarial AI Collaboration** - Not just consensus, but active debate and conflict resolution
2. **Real-Time Streaming** - Watch agents "think" and debate via WebSocket
3. **Comprehensive Output** - Production-ready company dossier in minutes
4. **Scalable Architecture** - Clean separation of concerns, easy to extend
5. **International Appeal** - Solves a global problem (startup validation)

### Technologies Used

- **native.builder** - Frontend platform (hackathon requirement)
- **AI/ML API** - LLM inference via OpenAI-compatible endpoint
- **FastAPI** - High-performance async Python framework
- **WebSockets** - Real-time bidirectional communication
- **Pydantic** - Type-safe data validation
- **Docker** - Containerization and deployment

---

## 📚 Documentation

### For Developers

- **[API Reference](.kiro/steering/api-reference.md)** - Complete endpoint documentation, TypeScript types, error handling
- **[Integration Guide](.kiro/steering/integration.md)** - How to connect native.builder frontend to FastAPI backend
- **[Tech Stack Details](.kiro/steering/tech.md)** - Architecture patterns, dependencies, common commands

### For Hackathon Judges

- **[Product Overview](.kiro/steering/product.md)** - Value proposition, features, target users
- **[Demo Guidelines](.kiro/steering/demo.md)** - How to record effective demo video
- **[Submission Checklist](.kiro/steering/submission.md)** - Hackathon requirements compliance

### Implementation Resources

- **[Backend Implementation Plan](docs/SIMPLIFIED_BACKEND_PLAN.md)** - Agent design and pipeline architecture
- **[Original PRD](docs/Day_One_PRD.pdf)** - Initial product requirements document

---

## 🤝 Contributing

While this is a hackathon project, we welcome feedback and suggestions!

### How to Contribute

1. **Report Issues** - Found a bug? Open an issue with reproduction steps
2. **Suggest Features** - Have ideas for improvement? Share them!
3. **Improve Documentation** - Spot a typo or unclear explanation? PR welcome!

### Development Workflow

```bash
# Fork the repository
git clone https://github.com/yourusername/DayOne.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and test thoroughly
pytest backend/  # Run tests

# Commit with clear messages
git commit -m "feat: add new agent capability"

# Push and create a pull request
git push origin feature/your-feature-name
```

---

## 🌍 International Accessibility

Day One is designed for a global audience:

- **Language-Agnostic Input:** Submit ideas in any language (LLM handles translation)
- **Universal Problem:** Startup validation challenges are global
- **Timezone-Friendly:** Fully automated, no human scheduling required
- **Cost-Effective:** Replaces expensive consultants ($5K-$50K+ → Free)
- **Scalable:** Cloud-hosted, serves users worldwide simultaneously

---

## 🏆 Awards & Recognition

**Target Categories:**
- 🥇 **AI/ML API Challenge** - Best use of AI/ML API ($1,000 in credits)
- 🎯 **Most Innovative Use of AI** - Adversarial collaboration pattern
- 🌟 **Best Real-Time Application** - WebSocket streaming experience

---

## 📄 License

This project is submitted for the AI Factory - Native.builder Hackathon.

**Ownership:** Day One team retains full ownership  
**Open Source:** MIT License (dependencies comply)  
**Assets:** All datasets, APIs, and IP used with proper permission

---

## 🙏 Acknowledgments

- **NativelyAI** - For the native.builder platform
- **lablab.ai** - For hosting the hackathon
- **AI/ML API** - For LLM inference credits
- **OpenAI** - For `gpt-4o-mini` model
- **Render** - For backend hosting

---

## 📞 Contact & Links

- **Live Application:** [https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/](https://ei61x8qbbc82gwybasmag5f1n-5173.preview.nativelyai.app/)
- **Backend API:** [https://dayone-sxkq.onrender.com](https://dayone-sxkq.onrender.com)
- **API Docs:** [https://dayone-sxkq.onrender.com/docs](https://dayone-sxkq.onrender.com/docs)
- **Hackathon Event:** [lablab.ai Event Page](https://lablab.ai/ai-hackathons/nativebuilder-build-without-limits)
- **Discord:** [lablab.ai Community](https://discord.gg/lablabai)

---

<div align="center">

**Built with ❤️ for the AI Factory - Native.builder Hackathon**

*Turning rough ideas into validated company plans, one coffee break at a time.* ☕

</div>


