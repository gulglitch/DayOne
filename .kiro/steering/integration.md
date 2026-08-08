# Day One - Native.builder Frontend Integration Guide

## Overview

This guide helps the native.builder frontend connect to the FastAPI backend that powers Day One's 6-agent startup validation system.

**Backend Tech**: Python FastAPI with WebSocket streaming  
**Frontend Tech**: Native.builder (React-based)  
**Integration Points**: REST API + WebSocket real-time streaming

---

## Backend Architecture Summary

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check and API info |
| `/health` | GET | System health and active sessions |
| `/api/analyze` | POST | Start new analysis (returns session_id) |
| `/ws/{session_id}` | WebSocket | Real-time agent message streaming |
| `/api/result/{session_id}` | GET | Fetch completed dossier |
| `/api/sessions` | GET | List all sessions |

### Data Flow

```
1. User submits idea → POST /api/analyze → Get session_id
2. Frontend connects → WebSocket /ws/{session_id} → Receive live messages
3. Agents run sequentially: Research → Product → Finance → Legal → Marketing → CEO
4. Each agent sends messages via WebSocket in real-time
5. On completion → GET /api/result/{session_id} → Fetch final dossier
```

---

## Step 1: Backend Deployment & CORS Setup

### ✅ Backend Already Deployed!

**Production Backend URL:**
```
https://dayone-sxkq.onrender.com
```

✅ Backend is live on Render.com  
✅ HTTPS enabled (required for WebSocket WSS)  
✅ CORS configured to accept all origins  
✅ Environment variables configured:
- `AIMLAPI_KEY=689002b0f2cae022cb8878a6e99e29b5`
- `MODEL_NAME=gpt-4o-mini`

**Important Notes about Render Free Tier:**
- Backend spins down after 15 minutes of inactivity
- First request after idle takes 30-60 seconds to wake up
- This is normal behavior for Render's free tier
- Subsequent requests are fast once warmed up

**For Testing:**
If backend is sleeping, the first API call or page load will take ~30-60 seconds. Just wait patiently - it's waking up!

### Local Backend (Optional for Development)

If you want to run backend locally for development:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Local URL:**
```
http://localhost:8000
```

⚠️ **Note**: Native.builder's published apps run on HTTPS, so they CANNOT call HTTP localhost APIs (mixed content blocked). Use the production URL above for published frontend.

### CORS Configuration

**Good news**: Backend already has CORS configured!

In `backend/app/main.py`, this middleware is already set:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows ALL origins (perfect for hackathon)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

✅ **No CORS changes needed** - Backend accepts requests from any origin, including native.builder's preview and published domains.

### Testing Backend

Test the production backend:

```bash
# Health check
curl https://dayone-sxkq.onrender.com/health

# Should return:
{
  "status": "healthy",
  "active_sessions": 0,
  "active_connections": 0
}

# Root endpoint
curl https://dayone-sxkq.onrender.com/

# Should return:
{
  "name": "Day One API",
  "version": "1.0.0",
  "status": "running",
  "docs": "/docs"
}
```

**API Documentation:**
Visit https://dayone-sxkq.onrender.com/docs for interactive API docs

---

## Step 2: Native.builder Frontend Integration

### A. Set Environment Variable (Backend URL)

In native.builder:
1. Open your project settings/environment variables
2. Add environment variable:
   - **Name**: `BACKEND_URL`
   - **Value**: `https://dayone-sxkq.onrender.com`

✅ **Use this exact URL:** `https://dayone-sxkq.onrender.com` (no trailing slash)

**Backend Configuration (Already Set):**
- **API Key**: `689002b0f2cae022cb8878a6e99e29b5` (AI/ML API from lablab.ai)
- **Model**: `gpt-4o-mini` (fast, cheap, good quality for hackathon)
- **Alternative Models** (can be changed in backend env):
  - `claude-3-5-sonnet` (best quality, more expensive)
  - `gpt-4o` (balanced performance and cost)

### B. Create API Integration Module

In native.builder, create a new file `api/backend.js` (or similar):

```javascript
// api/backend.js - Backend API Integration

const BACKEND_URL = process.env.BACKEND_URL || 'https://dayone-sxkq.onrender.com';

/**
 * Start a new startup idea analysis
 * @param {string} idea - The startup idea to analyze
 * @returns {Promise<{session_id: string, status: string}>}
 */
export async function startAnalysis(idea) {
  const response = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch the final dossier for a session
 * @param {string} sessionId - The session ID from startAnalysis
 * @returns {Promise<{session_id: string, status: string, dossier: object}>}
 */
export async function getResult(sessionId) {
  const response = await fetch(`${BACKEND_URL}/api/result/${sessionId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch result: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Connect to WebSocket for real-time agent updates
 * @param {string} sessionId - The session ID from startAnalysis
 * @param {Function} onMessage - Callback for each message: (event) => {}
 * @param {Function} onError - Callback for errors
 * @param {Function} onClose - Callback when connection closes
 * @returns {WebSocket} - The WebSocket connection (call .close() to disconnect)
 */
export function connectWebSocket(sessionId, onMessage, onError, onClose) {
  // Convert https:// to wss:// or http:// to ws://
  const wsUrl = BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://');
  const ws = new WebSocket(`${wsUrl}/ws/${sessionId}`);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
    if (onClose) onClose();
  };

  // Keep-alive: send ping every 25 seconds
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send('ping');
    }
  }, 25000);

  // Clear interval on close
  const originalClose = ws.close.bind(ws);
  ws.close = () => {
    clearInterval(pingInterval);
    originalClose();
  };

  return ws;
}
```

### C. Implement Page Components

#### Homepage - Idea Submission

```jsx
// pages/Home.jsx (or similar)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // or native.builder routing
import { startAnalysis } from '../api/backend';

export default function HomePage() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!idea.trim()) {
      setError('Please enter a startup idea');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await startAnalysis(idea);
      // Navigate to boardroom page with session_id
      navigate(`/boardroom/${result.session_id}`);
    } catch (err) {
      setError(err.message || 'Failed to start analysis');
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1>Day One - Startup Validation</h1>
      <p>Turn your rough idea into a validated company plan through AI adversarial collaboration.</p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your startup idea... (e.g., AI-powered meal planning app that uses grocery receipts)"
          rows={6}
          disabled={loading}
        />
        
        {error && <div className="error">{error}</div>}
        
        <button type="submit" disabled={loading || !idea.trim()}>
          {loading ? 'Starting Analysis...' : 'Validate My Idea'}
        </button>
      </form>
    </div>
  );
}
```

#### Boardroom Page - Live Agent Streaming

```jsx
// pages/Boardroom.jsx (or similar)
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connectWebSocket, getResult } from '../api/backend';

export default function BoardroomPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('connecting');
  const wsRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Connect to WebSocket
    wsRef.current = connectWebSocket(
      sessionId,
      // onMessage
      (data) => {
        setMessages((prev) => [...prev, data]);
        
        // If system message says "complete", navigate to dossier
        if (data.agent === 'system' && data.message.includes('complete')) {
          setStatus('completed');
          setTimeout(() => {
            navigate(`/dossier/${sessionId}`);
          }, 2000); // Wait 2s to show completion message
        } else if (data.type === 'error') {
          setStatus('error');
        } else {
          setStatus('running');
        }
      },
      // onError
      (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
      },
      // onClose
      () => {
        console.log('WebSocket disconnected');
      }
    );

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId, navigate]);

  return (
    <div className="boardroom-page">
      <h1>Boardroom Debate</h1>
      <p>Watch the C-suite agents analyze your idea in real-time...</p>
      
      <div className="status-bar">
        Status: <strong>{status}</strong>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message message-${msg.type} agent-${msg.agent}`}
          >
            <div className="message-header">
              <strong>{msg.agent.toUpperCase()}</strong>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="message-body">{msg.message}</div>
          </div>
        ))}
      </div>

      {status === 'completed' && (
        <button onClick={() => navigate(`/dossier/${sessionId}`)}>
          View Final Dossier
        </button>
      )}
    </div>
  );
}
```

#### Dossier Page - Final Result

```jsx
// pages/Dossier.jsx (or similar)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResult } from '../api/backend';

export default function DossierPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const fetchDossier = async () => {
      try {
        const result = await getResult(sessionId);
        
        if (result.status === 'completed' && result.dossier) {
          setDossier(result.dossier);
        } else if (result.status === 'running') {
          // Still running, poll every 2 seconds
          setTimeout(fetchDossier, 2000);
          return;
        } else {
          setError('Analysis not complete');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dossier');
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [sessionId, navigate]);

  if (loading) {
    return <div>Loading dossier...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Start New Analysis</button>
      </div>
    );
  }

  if (!dossier) {
    return <div>No dossier found</div>;
  }

  return (
    <div className="dossier-page">
      <h1>Company Dossier</h1>
      
      <section>
        <h2>Elevator Pitch</h2>
        <p className="elevator-pitch">{dossier.elevator_pitch}</p>
      </section>

      <section>
        <h2>Problem & Solution</h2>
        <p><strong>Problem:</strong> {dossier.problem_statement}</p>
        <p><strong>Target Audience:</strong> {dossier.target_audience}</p>
        <p><strong>Unique Value:</strong> {dossier.unique_value_prop}</p>
      </section>

      <section>
        <h2>Competitors</h2>
        <ul>
          {dossier.competitors.map((comp, i) => (
            <li key={i}>{comp}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>MVP Scope</h2>
        <ul>
          {dossier.mvp_scope.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Tech Stack</h2>
        <ul>
          {dossier.tech_stack.map((tech, i) => (
            <li key={i}>{tech}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Revenue Model</h2>
        <p>{dossier.revenue_model}</p>
      </section>

      <section>
        <h2>Legal Structure</h2>
        <p><strong>Structure:</strong> {dossier.legal_structure}</p>
        <p><strong>Compliance Requirements:</strong></p>
        <ul>
          {dossier.compliance_requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Marketing Strategy</h2>
        <p>{dossier.marketing_strategy}</p>
        <p><strong>Target Channels:</strong></p>
        <ul>
          {dossier.target_channels.map((channel, i) => (
            <li key={i}>{channel}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Challenges & Resolutions</h2>
        {dossier.challenges.map((challenge, i) => (
          <div key={i} className="challenge-card">
            <h3>Challenge from {challenge.raised_by.toUpperCase()}</h3>
            <p><strong>Target:</strong> {challenge.target}</p>
            <p><strong>Concern:</strong> {challenge.reason}</p>
            {challenge.resolution && (
              <p><strong>CEO Resolution:</strong> {challenge.resolution}</p>
            )}
          </div>
        ))}
      </section>

      <button onClick={() => navigate('/')}>Validate Another Idea</button>
    </div>
  );
}
```

---

## Step 3: Styling Agent Messages

Add CSS to differentiate message types:

```css
/* Message types */
.message-info {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.message-challenge {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
}

.message-resolution {
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.message-error {
  background: #ffebee;
  border-left: 4px solid #f44336;
}

/* Agent-specific colors */
.agent-research { border-color: #3f51b5; }
.agent-product { border-color: #9c27b0; }
.agent-finance { border-color: #ff9800; }
.agent-legal { border-color: #f44336; }
.agent-marketing { border-color: #4caf50; }
.agent-ceo { border-color: #ff5722; }
.agent-system { border-color: #607d8b; }
```

---

## Step 4: Testing Integration

### Testing Checklist

1. **Health Check**
   ```bash
   curl https://dayone-sxkq.onrender.com/health
   ```
   Should return `{"status": "healthy", ...}`
   
   ⚠️ **First request after idle**: May take 30-60 seconds (Render free tier wakes up from sleep)

2. **Start Analysis**
   ```bash
   curl -X POST https://dayone-sxkq.onrender.com/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"idea": "Test startup idea"}'
   ```
   Should return `{"session_id": "...", "status": "started", ...}`

3. **WebSocket Connection**
   - Use browser console or WebSocket testing tool
   - Connect to `wss://dayone-sxkq.onrender.com/ws/{session_id}`
   - Should receive JSON messages from agents

4. **Fetch Result**
   ```bash
   curl https://dayone-sxkq.onrender.com/api/result/{session_id}
   ```
   Should return dossier when completed

### Common Issues & Fixes

**Issue**: Backend takes 30-60 seconds to respond  
**Fix**: Normal behavior for Render free tier - backend is waking up from sleep. Wait patiently on first request.

**Issue**: CORS errors in browser console  
**Fix**: Backend already has `allow_origins=["*"]`, no fix needed

**Issue**: WebSocket connection fails  
**Fix**: Ensure using `wss://dayone-sxkq.onrender.com` (WSS protocol for HTTPS)

**Issue**: "Service Unavailable" 503 error  
**Fix**: Backend is sleeping - wait 30-60 seconds for it to wake up, then retry

**Issue**: WebSocket disconnects immediately  
**Fix**: Already implemented keep-alive pings in integration code

**Issue**: Messages not appearing  
**Fix**: Check browser console for errors, verify WebSocket is connected

---

## Step 5: Native.builder Deployment

Once integration is working in preview:

1. **Test thoroughly in preview mode**
   - Submit multiple test ideas
   - Watch agent messages stream
   - Verify dossier displays correctly

2. **Polish UI**
   - Adjust layouts for real message lengths
   - Add loading states
   - Style agent message cards
   - Add animations (optional)

3. **Final publish**
   - Click "Publish" in native.builder
   - Test published URL end-to-end
   - Share published URL for hackathon submission

---

## API Reference

### Message Event Structure

```typescript
interface MessageEvent {
  agent: "research" | "product" | "finance" | "legal" | "marketing" | "ceo" | "system";
  message: string;
  timestamp: string; // ISO 8601 format
  type: "info" | "challenge" | "resolution" | "error";
}
```

### Dossier Structure

```typescript
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

interface Challenge {
  raised_by: string;
  target: string;
  reason: string;
  resolution: string | null;
}
```

---

## Deployment Checklist

- [x] Backend deployed with HTTPS at https://dayone-sxkq.onrender.com
- [x] `AIMLAPI_KEY` set in backend environment
- [ ] Backend health endpoint returns 200 (test with curl)
- [ ] `BACKEND_URL` environment variable set in native.builder to `https://dayone-sxkq.onrender.com`
- [ ] API integration module created
- [ ] Homepage submits idea and gets session_id
- [ ] Boardroom page connects to WebSocket
- [ ] Messages display in real-time
- [ ] Auto-redirect to dossier on completion
- [ ] Dossier page fetches and displays result
- [ ] Error handling for network failures
- [ ] Tested with multiple startup ideas
- [ ] UI polished and responsive
- [ ] Published from native.builder
- [ ] Published URL tested end-to-end

---

## Support & Troubleshooting

**Backend not responding?**
- Check backend deployment logs
- Verify `AIMLAPI_KEY` is set
- Test health endpoint directly

**CORS errors?**
- Already handled in backend, should not occur
- If persisting, check browser console for exact error

**WebSocket not connecting?**
- Verify HTTPS/WSS protocol conversion
- Check browser console for connection errors
- Ensure session_id is valid

**Messages not streaming?**
- Confirm WebSocket is in OPEN state
- Check backend logs for errors
- Verify `onMessage` callback is registered

**Need help?**
- Backend source: `backend/app/main.py`
- Hackathon Discord: https://discord.gg/lablabai
- NativelyAI Discord: https://discord.gg/uP2TQVtkRj

---

## Quick Reference

**Backend Endpoints:**
```
POST   /api/analyze           → Start analysis
WS     /ws/{session_id}       → Real-time updates  
GET    /api/result/{session_id} → Fetch dossier
GET    /health                → Health check
```

**Production Backend:**
```
https://dayone-sxkq.onrender.com
```

**WebSocket URL:**
```
wss://dayone-sxkq.onrender.com/ws/{session_id}
```

**Frontend Flow:**
```
1. Submit idea → Get session_id
2. Connect WebSocket → Stream messages
3. On completion → Fetch dossier
4. Display dossier → Allow new analysis
```

**Agent Sequence:**
```
Research → Product → Finance → Legal → Marketing → CEO
```

**Message Types:**
- `info`: Standard progress updates
- `challenge`: Finance/Legal raising concerns
- `resolution`: CEO making decisions
- `error`: System errors

---

## Next Steps After Integration

1. **Record Demo Video** (see `demo.md` guide)
2. **Prepare Submission** (see `submission.md` checklist)
3. **Claim Partner Credits** (AI/ML API recommended)
4. **Test Published URL** thoroughly
5. **Submit to lablab.ai** before August 10, 2026 deadline

Good luck with your hackathon submission! 🚀
