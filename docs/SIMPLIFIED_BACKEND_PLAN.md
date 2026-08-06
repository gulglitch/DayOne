# Day One - Simplified Backend Implementation Plan
## AI Factory Hackathon via LabLab.ai

> **Reality Check**: The original PRD is ambitious. This plan focuses on **what you can actually demo in 8 days** while keeping the core "agents argue" magic.

---

## 🎯 Simplified Core Concept

We are creating all **6 agents** with a simplified implementation:
- **Sequential Pipeline**: Research → Product → Finance → Legal → Marketing → CEO
- **No complex orchestration** - just a sequential pipeline with challenge points
- **Pre-prompted disagreement** - Multiple agents challenge different aspects
- **One shared context object** - passed between agents

---

## 🛠 Tech Stack Recommendation

### Language: **Python 3.11+**
Why: Best LLM library support, fast prototyping, team likely knows it

### Framework: **FastAPI**
Why: 
- Built-in async support
- Auto-generated API docs
- WebSocket support out of the box
- Minimal boilerplate

### LLM Provider: **Anthropic Claude (via LangChain)**
Why:
- LabLab.ai provides credits for hackathons
- Claude Sonnet 3.5 is excellent at following structured output formats
- LangChain abstracts the API calls

### Key Libraries:
```python
fastapi==0.104.1           # API framework
uvicorn==0.24.0            # ASGI server
langchain==0.1.0           # LLM orchestration
langchain-anthropic==0.1.0 # Claude integration
pydantic==2.5.0            # Data validation
python-dotenv==1.0.0       # Environment variables
websockets==12.0           # Real-time streaming
```

### Database: **SQLite + JSON files**
Why: Zero setup, file-based, perfect for hackathon. Upgrade later if needed.

### No Redis, No PostgreSQL Setup
Why: Every minute counts. Use in-memory dict + file persistence.

---

## 🏗 Simplified Architecture

```
┌─────────────────┐
│   FastAPI App   │
│                 │
│  POST /analyze  │ ← User submits idea
│  WS /stream/:id │ ← Real-time updates
│  GET /result/:id│ ← Final dossier
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Pipeline │
    │ Manager  │
    └────┬─────┘
         │
    ┌────▼──────────────────────────┐
    │  Sequential Agent Pipeline    │
    │                               │
    │  1. Research Agent            │
    │     ↓ (context)               │
    │  2. Product Agent             │
    │     ↓ (context)               │
    │  3. Finance Agent             │
    │     ↓ (challenge!)            │
    │  4. Legal Agent               │
    │     ↓ (challenge!)            │
    │  5. Marketing Agent           │
    │     ↓ (context)               │
    │  6. CEO Agent (resolver)      │
    └───────────────────────────────┘
         │
    ┌────▼────────┐
    │  Storage    │
    │ (SQLite +   │
    │  JSON files)│
    └─────────────┘
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── models.py               # Pydantic models
│   ├── pipeline.py             # Main agent pipeline
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── research.py         # Research agent
│   │   ├── product.py          # Product agent
│   │   ├── finance.py          # Finance agent (challenger!)
│   │   ├── legal.py            # Legal agent (challenger!)
│   │   ├── marketing.py        # Marketing agent
│   │   └── ceo.py              # CEO resolver
│   ├── prompts/
│   │   ├── research_prompt.txt
│   │   ├── product_prompt.txt
│   │   ├── finance_prompt.txt
│   │   ├── legal_prompt.txt
│   │   ├── marketing_prompt.txt
│   │   └── ceo_prompt.txt
│   └── storage/
│       ├── db.py               # SQLite handler
│       └── sessions.py         # In-memory session manager
├── data/
│   └── sessions.db             # SQLite database
├── .env                        # API keys
├── requirements.txt
└── README.md
```

---

## 🔑 Core Data Models

```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class IdeaInput(BaseModel):
    idea: str
    target_market: Optional[str] = None

class AgentMessage(BaseModel):
    agent: str
    message: str
    timestamp: datetime
    type: str  # "info" | "challenge" | "resolution"

class Challenge(BaseModel):
    raised_by: str
    target: str
    reason: str
    resolution: Optional[str] = None

class CompanyDossier(BaseModel):
    idea: str
    problem_statement: str
    target_audience: str
    competitors: List[str]
    unique_value_prop: str
    mvp_scope: str
    tech_stack: List[str]
    revenue_model: str
    challenges: List[Challenge]
    elevator_pitch: str

class SessionState(BaseModel):
    session_id: str
    status: str  # "running" | "completed" | "error"
    messages: List[AgentMessage]
    dossier: Optional[CompanyDossier] = None
    created_at: datetime
```

---

## 🤖 Simplified Agent Implementation

### 1. Research Agent (First)
**Job**: Analyze the idea, find competitors, identify market

```python
# app/agents/research.py
from langchain_anthropic import ChatAnthropic
from langchain.prompts import PromptTemplate

class ResearchAgent:
    def __init__(self, api_key: str):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            anthropic_api_key=api_key,
            temperature=0.7
        )
        
    async def analyze(self, idea: str) -> dict:
        prompt = f"""You are a market research analyst for a startup incubator.

Analyze this startup idea: "{idea}"

Provide a structured analysis with:
1. Problem statement (2-3 sentences)
2. Target audience (specific demographic)
3. Top 3 competitors (real companies if possible)
4. Market size signal (Small/Medium/Large + brief reason)

Return ONLY valid JSON:
{{
    "problem_statement": "...",
    "target_audience": "...",
    "competitors": ["...", "...", "..."],
    "market_size": "..."
}}"""

        response = await self.llm.ainvoke(prompt)
        # Parse JSON response
        return json.loads(response.content)
```

### 2. Product Agent (Second)
**Job**: Define MVP, tech stack based on research

```python
# app/agents/product.py
class ProductAgent:
    def __init__(self, api_key: str):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            anthropic_api_key=api_key,
            temperature=0.7
        )
        
    async def design_mvp(self, context: dict) -> dict:
        prompt = f"""You are a product manager designing an MVP.

Based on this research:
- Problem: {context['problem_statement']}
- Audience: {context['target_audience']}
- Competitors: {', '.join(context['competitors'])}

Define:
1. MVP Scope (3-5 core features, be specific)
2. Tech Stack (frontend, backend, database)
3. Unique Value Proposition (1 sentence - what makes this different)

Return ONLY valid JSON:
{{
    "mvp_scope": ["feature 1", "feature 2", ...],
    "tech_stack": ["Next.js", "FastAPI", "PostgreSQL"],
    "unique_value_prop": "..."
}}"""

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
```

### 3. Finance Agent (The Challenger!)
**Job**: Challenge the product plan with financial reality

```python
# app/agents/finance.py
class FinanceAgent:
    def __init__(self, api_key: str):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            anthropic_api_key=api_key,
            temperature=0.8  # Higher temp for more "personality"
        )
        
    async def review_financials(self, context: dict) -> dict:
        prompt = f"""You are a skeptical CFO reviewing a startup plan.

The product team proposed:
- MVP: {context['mvp_scope']}
- Tech Stack: {context['tech_stack']}
- Target: {context['target_audience']}

Your job: Find ONE major financial red flag and challenge it.
Be specific and offer an alternative.

Also suggest:
1. Revenue model (specific pricing)
2. A challenge to the product plan

Return ONLY valid JSON:
{{
    "revenue_model": "...",
    "challenge": {{
        "target": "product_scope OR tech_stack",
        "reason": "Why this won't work financially...",
        "alternative": "Suggest a cheaper/faster approach"
    }}
}}"""

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
```

### 4. CEO Agent (Resolver)
**Job**: Make final decision on the challenge

```python
# app/agents/ceo.py
class CEOAgent:
    def __init__(self, api_key: str):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            anthropic_api_key=api_key,
            temperature=0.6
        )
        
    async def resolve_conflict(self, context: dict) -> dict:
        challenge = context['finance_challenge']
        
        prompt = f"""You are the CEO making the final call.

CONFLICT:
Finance challenged: {challenge['target']}
Reason: {challenge['reason']}
Alternative: {challenge['alternative']}

Original plan: {context['mvp_scope']}

Make a decision:
- ACCEPT the challenge and revise the plan
- REJECT the challenge and keep original plan
- COMPROMISE with a middle ground

Return ONLY valid JSON:
{{
    "decision": "ACCEPT | REJECT | COMPROMISE",
    "resolution": "Final decision in 2-3 sentences",
    "revised_mvp": ["updated feature list"] OR null
}}"""

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
```

---

## 🔄 Main Pipeline (The Secret Sauce)

```python
# app/pipeline.py
import asyncio
from datetime import datetime
from typing import Dict, Callable
from app.agents.research import ResearchAgent
from app.agents.product import ProductAgent
from app.agents.finance import FinanceAgent
from app.agents.ceo import CEOAgent

class CompanyPipeline:
    def __init__(self, api_key: str, websocket_callback: Callable = None):
        self.research = ResearchAgent(api_key)
        self.product = ProductAgent(api_key)
        self.finance = FinanceAgent(api_key)
        self.ceo = CEOAgent(api_key)
        self.ws_callback = websocket_callback
        
    async def emit_event(self, agent: str, message: str, type: str = "info"):
        """Send real-time update via WebSocket"""
        if self.ws_callback:
            await self.ws_callback({
                "agent": agent,
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
                "type": type
            })
    
    async def run(self, idea: str) -> CompanyDossier:
        context = {"idea": idea}
        
        # Step 1: Research
        await self.emit_event("research", "Analyzing market and competitors...")
        research_data = await self.research.analyze(idea)
        context.update(research_data)
        await self.emit_event("research", f"Found competitors: {', '.join(research_data['competitors'])}")
        
        # Step 2: Product
        await self.emit_event("product", "Designing MVP and tech stack...")
        product_data = await self.product.design_mvp(context)
        context.update(product_data)
        await self.emit_event("product", f"MVP: {len(product_data['mvp_scope'])} core features")
        
        # Step 3: Finance (THE CHALLENGE!)
        await self.emit_event("finance", "Reviewing financials...")
        finance_data = await self.finance.review_financials(context)
        context['finance_challenge'] = finance_data['challenge']
        
        # THIS IS THE WOW MOMENT - highlight the challenge
        await self.emit_event(
            "finance", 
            f"⚠️ CHALLENGE: {finance_data['challenge']['reason']}", 
            type="challenge"
        )
        
        await asyncio.sleep(1)  # Dramatic pause for demo
        
        # Step 4: CEO Resolution
        await self.emit_event("ceo", "Making final decision...")
        ceo_data = await self.ceo.resolve_conflict(context)
        
        await self.emit_event(
            "ceo",
            f"✓ DECISION: {ceo_data['resolution']}",
            type="resolution"
        )
        
        # Compile final dossier
        dossier = CompanyDossier(
            idea=idea,
            problem_statement=context['problem_statement'],
            target_audience=context['target_audience'],
            competitors=context['competitors'],
            unique_value_prop=context['unique_value_prop'],
            mvp_scope=ceo_data.get('revised_mvp') or context['mvp_scope'],
            tech_stack=context['tech_stack'],
            revenue_model=finance_data['revenue_model'],
            challenges=[{
                "raised_by": "finance",
                "target": "product",
                "reason": finance_data['challenge']['reason'],
                "resolution": ceo_data['resolution']
            }],
            elevator_pitch=await self._generate_pitch(context, ceo_data)
        )
        
        return dossier
    
    async def _generate_pitch(self, context: dict, ceo_data: dict) -> str:
        """Generate final elevator pitch"""
        # Simple template or another LLM call
        prompt = f"""Create a 2-sentence elevator pitch for:
Problem: {context['problem_statement']}
Solution: {context['unique_value_prop']}
Market: {context['target_audience']}

Make it punchy and investor-ready."""
        
        response = await self.ceo.llm.ainvoke(prompt)
        return response.content.strip()
```

---

## 🌐 FastAPI Endpoints

```python
# app/main.py
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import uuid
from datetime import datetime
from typing import Dict

app = FastAPI(title="Day One API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (simple for hackathon)
sessions: Dict[str, SessionState] = {}
active_websockets: Dict[str, WebSocket] = {}

@app.post("/api/analyze")
async def start_analysis(idea_input: IdeaInput):
    """Start a new company analysis"""
    session_id = str(uuid.uuid4())
    
    session = SessionState(
        session_id=session_id,
        status="running",
        messages=[],
        dossier=None,
        created_at=datetime.utcnow()
    )
    sessions[session_id] = session
    
    # Start pipeline in background
    asyncio.create_task(run_pipeline(session_id, idea_input.idea))
    
    return {"session_id": session_id, "status": "started"}

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """Real-time updates stream"""
    await websocket.accept()
    active_websockets[session_id] = websocket
    
    try:
        # Keep connection alive
        while True:
            await asyncio.sleep(1)
    except:
        del active_websockets[session_id]

@app.get("/api/result/{session_id}")
async def get_result(session_id: str):
    """Get final dossier"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    if session.status == "running":
        return {"status": "running", "dossier": None}
    elif session.status == "completed":
        return {"status": "completed", "dossier": session.dossier}
    else:
        return {"status": "error", "error": "Pipeline failed"}

async def run_pipeline(session_id: str, idea: str):
    """Background task to run agent pipeline"""
    session = sessions[session_id]
    
    # Callback to send WebSocket updates
    async def ws_callback(event: dict):
        session.messages.append(AgentMessage(**event))
        if session_id in active_websockets:
            try:
                await active_websockets[session_id].send_json(event)
            except:
                pass  # Connection closed
    
    try:
        # Run the pipeline
        pipeline = CompanyPipeline(
            api_key=os.getenv("ANTHROPIC_API_KEY"),
            websocket_callback=ws_callback
        )
        
        dossier = await pipeline.run(idea)
        
        # Update session
        session.dossier = dossier
        session.status = "completed"
        
    except Exception as e:
        session.status = "error"
        print(f"Pipeline error: {e}")

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

---

## 📝 Environment Setup

```bash
# .env
ANTHROPIC_API_KEY=your_lablab_provided_key_here
```

```txt
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
langchain==0.1.0
langchain-anthropic==0.1.0
pydantic==2.5.0
python-dotenv==1.0.0
websockets==12.0
aiosqlite==0.19.0
```

---

## 🚀 Running the Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Test endpoint
curl http://localhost:8000/health

# API docs (auto-generated!)
open http://localhost:8000/docs
```

---

## 🎬 8-Day Development Plan

### Day 1: Setup & Research Agent
- [ ] Project structure
- [ ] FastAPI skeleton
- [ ] Research agent working with hardcoded idea
- [ ] Test Claude API integration

### Day 2: Product & Finance Agents
- [ ] Product agent implementation
- [ ] Finance agent with challenge logic
- [ ] Test sequential pipeline locally

### Day 3: CEO Agent & Pipeline
- [ ] CEO resolver agent
- [ ] Full pipeline integration
- [ ] Basic error handling

### Day 4: WebSocket Streaming
- [ ] WebSocket endpoint
- [ ] Real-time event emission
- [ ] Test with mock frontend (Postman/curl)

### Day 5: Storage & Sessions
- [ ] Session management
- [ ] SQLite persistence
- [ ] GET result endpoint

### Day 6: Polish & Testing
- [ ] Timeout handling
- [ ] Better error messages
- [ ] Test with 5+ different ideas

### Day 7: Integration & Demo Prep
- [ ] Connect to frontend
- [ ] End-to-end testing
- [ ] Fix critical bugs

### Day 8: Demo Day
- [ ] Final testing
- [ ] Deploy (Railway/Render)
- [ ] Prepare backup demo recording

---

## 🎯 Why This Works for a Hackathon

1. **No Complex Orchestration** - Sequential pipeline is predictable
2. **No Infrastructure Hell** - SQLite + in-memory state
3. **Guaranteed Conflict** - Finance always challenges something
4. **Fast to Build** - 4 agents × 50 lines each = 200 lines of agent code
5. **Easy to Demo** - Predictable flow, fast runtime (<60 seconds)
6. **Real LLM Magic** - Still using Claude, still looks impressive

---

## ⚡ Quick Wins for Demo Impact

1. **Add typing animations** in WebSocket events (simulate thinking)
2. **Emoji markers** for events (🔍 Research, 💡 Product, 💰 Finance, ⚖️ CEO)
3. **Sleep 1 second** before CEO resolution (dramatic pause)
4. **Pre-test with 3 ideas** and know they work
5. **Fallback responses** if LLM fails (canned but idea-specific)

---

## 🏆 LabLab.ai Hackathon Tips

- **Use their provided API credits** - don't worry about cost optimization yet
- **Submit early** - Even if incomplete, having something live matters
- **Document everything** - README with setup steps = extra points
- **Show the code** - Judges love seeing actual implementation
- **One-click deploy** - Railway/Render + GitHub = instant credibility

---

## 🔧 Troubleshooting

**LLM returns non-JSON?**
→ Add retry logic with explicit "ONLY JSON" in prompt

**WebSocket disconnects?**
→ Add ping/pong keep-alive every 30 seconds

**Pipeline too slow?**
→ Use Claude Haiku instead of Sonnet for non-critical agents

**Demo crashes?**
→ Have a pre-recorded run ready as backup

---

## 📚 Learning Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [LangChain Quickstart](https://python.langchain.com/docs/get_started/quickstart)
- [Claude API Docs](https://docs.anthropic.com/)
- [WebSocket Tutorial](https://fastapi.tiangolo.com/advanced/websockets/)

---

**Ready to build?** Start with Day 1 tasks and the Research agent. The rest follows naturally. Good luck! 🚀
