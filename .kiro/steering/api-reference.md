# Day One - Complete API Reference

## Base URL
```
https://dayone-sxkq.onrender.com
```

## Authentication
No authentication required (hackathon version)

---

## Endpoints

### 1. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "active_sessions": 2,
  "active_connections": 0
}
```

---

### 2. Start Analysis
**POST** `/api/analyze`

**Request Body:**
```json
{
  "idea": "Your startup idea here",
  "target_market": "optional specific market"  // Optional field
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

**Fields:**
- `session_id` (string): UUID to use for WebSocket connection and result retrieval
- `status` (string): Always "started" on successful creation
- `message` (string): Human-readable status message

---

### 3. WebSocket - Real-Time Updates
**WebSocket** `/ws/{session_id}`

**URL Pattern:**
```
wss://dayone-sxkq.onrender.com/ws/{session_id}
```

**Connection:**
```javascript
const ws = new WebSocket('wss://dayone-sxkq.onrender.com/ws/22f2014f-fe3d-4596-9d99-d4e60a4354dd');

ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

**Message Format:**
```json
{
  "agent": "research",
  "message": "🔍 Analyzing market and competitors...",
  "timestamp": "2026-08-09T12:34:56.789Z",
  "type": "info"
}
```

**Fields:**
- `agent` (string): One of: "research", "product", "finance", "legal", "marketing", "ceo", "system"
- `message` (string): Agent's message or status update
- `timestamp` (string): ISO 8601 timestamp
- `type` (string): One of: "info", "challenge", "resolution", "error", "ping"

**Message Types:**
- `info`: Standard progress updates
- `challenge`: Finance or Legal raising concerns
- `resolution`: CEO making final decisions
- `error`: System or pipeline errors
- `ping`: Keep-alive message (can be ignored)

**Special Messages:**
- System message with "complete" in text → Analysis finished, fetch dossier
- System message with "error" → Pipeline failed

**Agent Sequence:**
1. system → Connection confirmation
2. research → Market analysis
3. product → MVP design
4. finance → Financial review + Challenge
5. legal → Legal review + Challenge
6. marketing → Marketing strategy
7. ceo → Final decisions + Resolution
8. system → Completion notification

---

### 4. Get Result
**GET** `/api/result/{session_id}`

**URL Pattern:**
```
https://dayone-sxkq.onrender.com/api/result/22f2014f-fe3d-4596-9d99-d4e60a4354dd
```

**Response (Status: running):**
```json
{
  "session_id": "22f2014f-fe3d-4596-9d99-d4e60a4354dd",
  "status": "running",
  "dossier": null,
  "messages": [...],
  "created_at": "2026-08-09T12:34:56.789Z"
}
```

**Response (Status: completed):**
```json
{
  "session_id": "22f2014f-fe3d-4596-9d99-d4e60a4354dd",
  "status": "completed",
  "dossier": {
    "idea": "Original startup idea",
    "problem_statement": "The problem being solved",
    "target_audience": "Who this is for",
    "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
    "unique_value_prop": "What makes this unique",
    "mvp_scope": [
      "Core feature 1",
      "Core feature 2",
      "Core feature 3"
    ],
    "tech_stack": [
      "Technology 1",
      "Technology 2",
      "Technology 3"
    ],
    "revenue_model": "How the company makes money",
    "legal_structure": "Recommended legal entity type",
    "compliance_requirements": [
      "Requirement 1",
      "Requirement 2"
    ],
    "marketing_strategy": "Go-to-market approach",
    "target_channels": [
      "Channel 1",
      "Channel 2",
      "Channel 3"
    ],
    "challenges": [
      {
        "raised_by": "finance",
        "target": "revenue_model",
        "reason": "Financial concern raised",
        "resolution": "CEO's decision on how to address it"
      },
      {
        "raised_by": "legal",
        "target": "compliance",
        "reason": "Legal risk identified",
        "resolution": "CEO's resolution strategy"
      }
    ],
    "elevator_pitch": "30-second investor pitch"
  },
  "messages": [
    {
      "agent": "research",
      "message": "Message text",
      "timestamp": "2026-08-09T12:34:56.789Z",
      "type": "info"
    }
  ],
  "created_at": "2026-08-09T12:34:56.789Z"
}
```

**Top-Level Fields:**
- `session_id` (string): The session UUID
- `status` (string): "running", "completed", or "error"
- `dossier` (object|null): Full analysis result (null until completed)
- `messages` (array): All WebSocket messages sent during analysis
- `created_at` (string): ISO 8601 timestamp of session creation

**Dossier Fields:**
- `idea` (string): Original idea submitted
- `problem_statement` (string): Problem being solved
- `target_audience` (string): Target user description
- `competitors` (array of strings): List of competitors
- `unique_value_prop` (string): Unique value proposition
- `mvp_scope` (array of strings): Core MVP features
- `tech_stack` (array of strings): Recommended technologies
- `revenue_model` (string): Monetization strategy
- `legal_structure` (string): Recommended legal entity
- `compliance_requirements` (array of strings): Legal/regulatory requirements
- `marketing_strategy` (string): Marketing approach
- `target_channels` (array of strings): Marketing channels
- `challenges` (array of objects): Challenges raised by Finance/Legal
- `elevator_pitch` (string): 30-second pitch

**Challenge Object:**
- `raised_by` (string): "finance" or "legal"
- `target` (string): What aspect was challenged
- `reason` (string): Why it was challenged
- `resolution` (string): CEO's resolution

---

### 5. List Sessions
**GET** `/api/sessions`

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "22f2014f-fe3d-4596-9d99-d4e60a4354dd",
      "status": "completed",
      "created_at": "2026-08-09T12:34:56.789Z",
      "has_result": true
    },
    {
      "session_id": "c40312bd-f4ea-4212-974b-5a47168e4c9c",
      "status": "running",
      "created_at": "2026-08-09T13:00:00.000Z",
      "has_result": false
    }
  ]
}
```

---

## TypeScript Type Definitions

```typescript
// Request Types
interface StartAnalysisRequest {
  idea: string;
  target_market?: string;
}

// Response Types
interface StartAnalysisResponse {
  session_id: string;
  status: "started";
  message: string;
}

interface HealthResponse {
  status: "healthy" | "unhealthy";
  active_sessions: number;
  active_connections: number;
}

// WebSocket Message
interface AgentMessage {
  agent: "research" | "product" | "finance" | "legal" | "marketing" | "ceo" | "system";
  message: string;
  timestamp: string; // ISO 8601
  type: "info" | "challenge" | "resolution" | "error" | "ping";
}

// Challenge
interface Challenge {
  raised_by: "finance" | "legal";
  target: string;
  reason: string;
  resolution: string;
}

// Dossier
interface CompanyDossier {
  idea: string;
  problem_statement: string;
  target_audience: string;
  competitors: string[];
  unique_value_prop: string;
  mvp_scope: string[];
  tech_stack: string[];
  revenue_model: string;
  legal_structure: string;
  compliance_requirements: string[];
  marketing_strategy: string;
  target_channels: string[];
  challenges: Challenge[];
  elevator_pitch: string;
}

// Session Result
interface SessionResult {
  session_id: string;
  status: "running" | "completed" | "error";
  dossier: CompanyDossier | null;
  messages: AgentMessage[];
  created_at: string; // ISO 8601
}

// Session List Item
interface SessionListItem {
  session_id: string;
  status: "running" | "completed" | "error";
  created_at: string; // ISO 8601
  has_result: boolean;
}

interface SessionsListResponse {
  sessions: SessionListItem[];
}
```

---

## Integration Flow

### Complete Workflow

```javascript
// 1. Start analysis
const startResponse = await fetch('https://dayone-sxkq.onrender.com/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idea: 'My startup idea' })
});
const { session_id } = await startResponse.json();

// 2. Connect WebSocket for real-time updates
const ws = new WebSocket(`wss://dayone-sxkq.onrender.com/ws/${session_id}`);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  // Display message in UI
  console.log(`[${message.agent}] ${message.message}`);
  
  // Check for completion
  if (message.agent === 'system' && message.message.includes('complete')) {
    ws.close();
    fetchFinalDossier(session_id);
  }
};

// 3. Fetch final dossier
async function fetchFinalDossier(sessionId) {
  const response = await fetch(`https://dayone-sxkq.onrender.com/api/result/${sessionId}`);
  const result = await response.json();
  
  if (result.status === 'completed' && result.dossier) {
    // Display dossier
    console.log(result.dossier);
  }
}
```

---

## Error Handling

### HTTP Errors

**404 Not Found** - Session doesn't exist
```json
{
  "detail": "Session not found"
}
```

**503 Service Unavailable** - Backend is waking up (Render free tier)
- Wait 30-60 seconds and retry
- Normal behavior after 15 minutes of inactivity

**500 Internal Server Error** - Pipeline error
```json
{
  "detail": "Internal server error"
}
```

### WebSocket Errors

**Connection Failed**
- Check session_id is valid
- Ensure using WSS protocol (not WS)
- Backend might be sleeping (wait and retry)

**Unexpected Disconnect**
- Backend might have crashed
- Check session status via GET /api/result/{session_id}

**Error Message from Pipeline**
```json
{
  "agent": "system",
  "message": "Pipeline error: AIMLAPI_KEY not set",
  "timestamp": "2026-08-09T12:34:56.789Z",
  "type": "error"
}
```

---

## Testing with curl

```bash
# Test health
curl https://dayone-sxkq.onrender.com/health

# Start analysis
curl -X POST https://dayone-sxkq.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI-powered meal planning app"}'

# Get result (replace session_id)
curl https://dayone-sxkq.onrender.com/api/result/22f2014f-fe3d-4596-9d99-d4e60a4354dd

# List all sessions
curl https://dayone-sxkq.onrender.com/api/sessions
```

---

## Testing WebSocket (Browser Console)

```javascript
const sessionId = '22f2014f-fe3d-4596-9d99-d4e60a4354dd'; // From /api/analyze
const ws = new WebSocket(`wss://dayone-sxkq.onrender.com/ws/${sessionId}`);

ws.onopen = () => console.log('✅ Connected');
ws.onmessage = (e) => console.log('📨', JSON.parse(e.data));
ws.onerror = (e) => console.error('❌ Error:', e);
ws.onclose = () => console.log('🔌 Disconnected');
```

---

## Performance Notes

### Render Free Tier Behavior
- Backend sleeps after 15 minutes of inactivity
- First request after sleep: 30-60 seconds to wake up
- Subsequent requests: Fast response
- This is normal and expected behavior

### Analysis Duration
- Typical pipeline runtime: 30-90 seconds
- Depends on LLM API response times
- Model used: `gpt-4o-mini` (fast and cheap)

### WebSocket Keep-Alive
- Backend sends ping every 30 seconds
- Frontend should send pong or any message to keep connection alive
- Automatic in most WebSocket clients

---

## API Documentation

Interactive API docs available at:
```
https://dayone-sxkq.onrender.com/docs
```

Alternative ReDoc format:
```
https://dayone-sxkq.onrender.com/redoc
```
