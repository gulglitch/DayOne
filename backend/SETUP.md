# Backend Setup Guide

Complete guide to get the Day One backend running.

## Prerequisites

- **Python 3.11+** (check with `python --version`)
- **pip** package manager
- **OpenRouter API key** (FREE - get from https://openrouter.ai/settings/keys)
  - No credit card required!
  - See [GET_API_KEY.md](GET_API_KEY.md) for step-by-step instructions

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

If you prefer using a virtual environment (recommended):

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

**Get your FREE OpenRouter API key:**
1. Visit https://openrouter.ai/auth/signup (no credit card needed!)
2. Go to https://openrouter.ai/settings/keys
3. Click "Create Key" and copy it

**Create `.env` file:**

```bash
echo OPENROUTER_API_KEY=sk-or-v1-your_key_here > .env
echo MODEL_NAME=openrouter/free >> .env
```

Or manually create `.env` and add:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
MODEL_NAME=openrouter/free
```

**Important**: Never commit your `.env` file to git! It's already in `.gitignore`.

**Model Options:**
- `openrouter/free` - Auto-selects from free models (recommended)
- `meta-llama/llama-3.2-3b-instruct:free` - Llama 3.2 3B
- `qwen/qwen-2.5-7b-instruct:free` - Qwen 2.5 7B
- `deepseek/deepseek-chat:free` - DeepSeek Chat

See full list at: https://openrouter.ai/models?pricing=free

### 3. Start the Server

**Option A: Using the batch script (Windows)**
```bash
start.bat
```

**Option B: Direct command**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: http://localhost:8000

### 4. Test the API

Open your browser and visit:
- **API Docs**: http://localhost:8000/docs (interactive documentation)
- **Health Check**: http://localhost:8000/health

Or run the test script:
```bash
python test_api.py
```

## API Usage Examples

### Using curl

```bash
# Start an analysis
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI-powered fitness coaching app"}'

# Response: {"session_id": "xxx-xxx-xxx", "status": "started"}

# Check results (replace {session_id} with actual ID)
curl http://localhost:8000/api/result/{session_id}
```

### Using Python

```python
import requests

# Start analysis
response = requests.post(
    "http://localhost:8000/api/analyze",
    json={"idea": "Subscription service for sustainable fashion"}
)
session_id = response.json()["session_id"]

# Get results
result = requests.get(f"http://localhost:8000/api/result/{session_id}")
print(result.json())
```

### WebSocket Connection (Real-time Updates)

```javascript
// JavaScript example
const ws = new WebSocket(`ws://localhost:8000/ws/${session_id}`);

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(`${data.agent}: ${data.message}`);
};
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root endpoint |
| `/health` | GET | Health check |
| `/api/analyze` | POST | Start analysis |
| `/api/result/{session_id}` | GET | Get results |
| `/ws/{session_id}` | WebSocket | Real-time updates |
| `/api/sessions` | GET | List all sessions |
| `/docs` | GET | Interactive API docs |

## Expected Output

When you submit an idea, the 6 agents will:

1. **Research** 🔍 - Analyzes market, finds competitors
2. **Product** 💡 - Defines MVP features and tech stack
3. **Finance** 💰 - Challenges financial viability
4. **Legal** ⚖️ - Identifies legal risks
5. **Marketing** 📢 - Creates go-to-market strategy
6. **CEO** 👔 - Makes final decisions

Final output is a `CompanyDossier` with:
- Problem statement
- Target audience
- Competitors
- MVP scope
- Tech stack
- Revenue model
- Legal structure
- Marketing strategy
- Challenges and resolutions
- Elevator pitch

## Troubleshooting

### "ModuleNotFoundError"
→ Make sure you installed dependencies: `pip install -r requirements.txt`

### "OPENROUTER_API_KEY not set"
→ Check your `.env` file exists and has the correct key
→ See GET_API_KEY.md for instructions on getting a free key

### "Connection refused" on test_api.py
→ Make sure the server is running: `uvicorn app.main:app --reload`

### Slow responses
→ Free models may be slower during peak times
→ Each agent call takes 3-10 seconds
→ Full pipeline runs 60-120 seconds

### JSON parsing errors
→ Occasionally LLMs return invalid JSON. We'll add retry logic if needed.

## Development Tips

### Hot Reload
The `--reload` flag watches for file changes and auto-restarts the server.

### Logs
Check terminal output for agent messages and errors.

### Testing Ideas
Try these test ideas:
- "AI-powered meal planning for busy professionals"
- "Sustainable fashion rental marketplace"
- "B2B SaaS for construction project management"
- "Social fitness app with virtual competitions"

### Modify Agent Behavior
Edit files in `app/agents/` to change how each agent thinks.

## Next Steps

- [ ] Test with multiple ideas
- [ ] Add error handling and retries
- [ ] Build frontend interface
- [ ] Deploy to Railway/Render
- [ ] Add rate limiting
- [ ] Implement session persistence

## Support

For issues or questions:
1. Check the logs in the terminal
2. Review the simplified backend plan: `docs/SIMPLIFIED_BACKEND_PLAN.md`
3. Test with the interactive docs: http://localhost:8000/docs

---

**Ready to validate your startup idea?** 🚀
