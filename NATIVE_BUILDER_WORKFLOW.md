# Native.Builder Complete Workflow Guide

## 🎯 **Overview**

This guide walks you through building the Day One frontend in Native.Builder while connecting to your existing FastAPI backend.

**Estimated Time:** 3-4 hours
**Credits Used:** ~20-30 of your 50 credits
**Result:** Deployed frontend + backend integration

---

## 📋 **Phase 1: Backend Deployment (Do This FIRST)**

### **Why First?**
Native.Builder needs a live URL to connect to. You can't test the integration without a deployed backend.

### **Step 1.1: Get Your API Key Ready**
```bash
# Open backend/.env and paste your AI/ML API key
AIMLAPI_KEY=sk-your-actual-key-here
MODEL_NAME=gpt-4o-mini
```

### **Step 1.2: Test Locally (5 mins)**
```bash
cd backend
uvicorn app.main:app --reload

# In another terminal:
python test_api.py
```

**Expected:** Health check passes, analysis starts

### **Step 1.3: Deploy to Railway (15 mins)**

**Option A: Railway (Recommended - $5/month)**

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. Add environment variables:
   ```bash
   railway variables set AIMLAPI_KEY=sk-your-key-here
   railway variables set MODEL_NAME=gpt-4o-mini
   ```

4. Generate public domain:
   ```bash
   railway domain
   ```
   
   **Copy this URL!** You'll need it: `https://dayone-backend-production.up.railway.app`

**Option B: Render (Free tier)**

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo (push your code first)
4. Settings:
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   - `AIMLAPI_KEY` = your key
   - `MODEL_NAME` = gpt-4o-mini
6. Deploy
7. **Copy the URL:** `https://dayone-backend.onrender.com`

### **Step 1.4: Test Deployed Backend (5 mins)**

```bash
# Replace with your actual URL
curl https://your-backend-url.com/health

# Should return: {"status":"healthy"}
```

**✅ Backend is ready when:**
- [ ] `/health` endpoint works
- [ ] You have the public URL copied
- [ ] Environment variables are set

---

## 📋 **Phase 2: Native.Builder Frontend (Main Work)**

### **Step 2.1: Prepare Your Backend URL**

Before starting, have ready:
- **Backend URL:** `https://your-backend-url.com`
- **WebSocket URL:** `wss://your-backend-url.com/ws/`
- **API Endpoints:**
  - POST `/api/analyze`
  - GET `/api/result/{session_id}`
  - WS `/ws/{session_id}`

### **Step 2.2: Open Native.Builder**

1. Go to: https://builder.nativelyai.com/
2. Login with your account
3. Click "New Project"
4. Name it: `DayOne-Frontend`

### **Step 2.3: Use The Master Prompt**

**📄 Use the prompt from `NATIVE_BUILDER_PROMPT.md`**

Copy the ENTIRE prompt and paste it into Native.Builder.

**⏱️ This will take 3-5 minutes and use ~5-8 credits**

### **Step 2.4: Configure Backend Integration (CRITICAL)**

After initial generation, Native.Builder will ask about API configuration:

```
Prompt Native.Builder:

"Configure API integration:

Base URL: https://your-actual-backend-url.com

Endpoints:
1. POST /api/analyze
   - Body: { "idea": string }
   - Returns: { "session_id": string, "status": string }

2. GET /api/result/{session_id}
   - Returns: { "status": string, "dossier": object, "messages": array }

3. WebSocket /ws/{session_id}
   - Receives: { "agent": string, "message": string, "type": string, "timestamp": string }

Add CORS headers:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET, POST, OPTIONS
- Access-Control-Allow-Headers: Content-Type

Test the /health endpoint first to verify connection."
```

**⏱️ This uses ~3-5 credits**

### **Step 2.5: Refine the UI (Iterative)**

**Iteration 1: Fix Layout Issues**
```
"Review the boardroom layout. Make sure:
- 6 agent avatars are clearly visible
- Messages appear in a scrollable feed
- Progress indicator shows which agent is active
- Use a dark theme (#0a0e27 background)"
```

**⏱️ Uses ~2-3 credits per iteration**

**Iteration 2: Add Real-time Updates**
```
"Connect to WebSocket at wss://your-backend-url.com/ws/{session_id}
When messages arrive:
- Highlight the speaking agent
- Add message to the feed with animation
- Update progress bar
- Show emoji indicators (🔍 for research, 💰 for finance, etc.)"
```

**⏱️ Uses ~3-4 credits**

**Iteration 3: Polish Dossier View**
```
"On the dossier page, display all data from the API response:
- Hero section with elevator pitch
- Grid layout for problem/solution/market
- Cards for MVP features
- Competitor comparison table
- Challenges section showing finance/legal concerns
- Export to PDF button
- Share link functionality"
```

**⏱️ Uses ~3-4 credits**

### **Step 2.6: Test Integration (IMPORTANT)**

**Manual Test Flow:**

1. Click "Preview" in Native.Builder
2. Enter a test idea: "AI-powered meal planning for busy professionals"
3. Submit and watch:
   - ✅ Loading state appears
   - ✅ Redirects to boardroom view
   - ✅ WebSocket connects (check browser console)
   - ✅ Agent messages appear in real-time
   - ✅ Analysis completes
   - ✅ Dossier displays correctly

**If something breaks:**
- Check browser console for errors
- Verify backend URL is correct
- Test backend endpoints with curl
- Check CORS is enabled on backend

### **Step 2.7: Debug Common Issues**

**Issue: "Failed to fetch"**
```
Tell Native.Builder:
"Add error handling for API calls. If fetch fails:
- Show error message to user
- Log error details to console
- Provide 'Try Again' button
- Check if backend URL is reachable"
```

**Issue: "WebSocket won't connect"**
```
Tell Native.Builder:
"Debug WebSocket connection:
- Log connection attempts
- Handle reconnection on disconnect
- Show connection status to user
- Verify URL format: wss:// not ws://"
```

**Issue: "CORS errors"**
```
Your backend already has CORS enabled. If still seeing errors:
- Verify backend is deployed
- Check environment variables are set
- Test with curl to confirm backend works
```

**⏱️ Debug iterations: ~2-3 credits each**

---

## 📋 **Phase 3: Deploy Frontend**

### **Step 3.1: Deploy from Native.Builder**

1. Click "Deploy" button in Native.Builder
2. Choose deployment option (Native.Builder handles hosting)
3. Wait 2-5 minutes for build
4. **Copy your frontend URL:** `https://dayone.nativelyai.app`

### **Step 3.2: Test Live Deployment**

1. Open your deployed frontend URL
2. Submit a test idea
3. Verify full flow works:
   - ✅ Frontend loads
   - ✅ Can submit idea
   - ✅ Backend receives request
   - ✅ Real-time updates work
   - ✅ Dossier displays

### **Step 3.3: Final Polish (Optional - 5 credits)**

```
"Polish the UI:
- Add loading skeletons instead of spinners
- Improve typography and spacing
- Add subtle animations
- Optimize mobile responsiveness
- Add favicon and meta tags for sharing"
```

---

## 📋 **Phase 4: Demo Video & Submission**

### **Step 4.1: Record Demo Video (3 mins max)**

**Script:**

1. **Opening (15 sec):**
   - "Meet Day One - AI boardroom for startup validation"
   - Show landing page

2. **Submission (20 sec):**
   - Enter idea: "AI-powered personal finance coach"
   - Click submit
   - Show transition to boardroom

3. **Live Boardroom (90 sec):**
   - Watch agents discuss in real-time
   - Highlight challenges from Finance and Legal
   - Show CEO making final decisions

4. **Dossier (45 sec):**
   - Scroll through complete analysis
   - Highlight key sections
   - Show elevator pitch

5. **Closing (10 sec):**
   - "Built with Native.Builder + FastAPI + AI/ML API"
   - Show both URLs

**Tools:**
- OBS Studio (free, best quality)
- Loom (easy, web-based)
- Windows Game Bar (Win+G, quick)

### **Step 4.2: Prepare Submission**

**Required Information:**

1. **Project Description:**
   ```
   Day One is an AI-powered startup validation platform that simulates 
   a boardroom of 6 specialized AI agents (Research, Product, Finance, 
   Legal, Marketing, CEO) who analyze, challenge, and validate startup 
   ideas in real-time.
   
   Frontend: Built with Native.Builder
   Backend: FastAPI with 6 LangChain agents
   AI: AI/ML API (GPT-4o-mini)
   Real-time: WebSocket streaming
   ```

2. **Target User:**
   ```
   Aspiring entrepreneurs and founders who want to validate their 
   startup ideas before investing time and money, receiving expert-level 
   analysis across multiple business domains in minutes instead of weeks.
   ```

3. **Native.Builder Usage:**
   ```
   Used Native.Builder to generate the entire frontend UI, handle 
   routing, manage WebSocket connections, and create responsive 
   components. Backend API integration was configured through 
   Native.Builder's workflow system.
   ```

4. **Technologies Used:**
   - Native.Builder (frontend generation & hosting)
   - FastAPI (custom backend)
   - AI/ML API (LLM inference)
   - LangChain (agent orchestration)
   - WebSocket (real-time streaming)
   - Railway/Render (backend hosting)

5. **URLs:**
   - Frontend: `https://your-frontend-url.nativelyai.app`
   - Backend API: `https://your-backend-url.com`
   - GitHub: `https://github.com/yourusername/DayOne`
   - Demo Video: `https://youtube.com/watch?v=...`

### **Step 4.3: Submit to Hackathon**

1. Go to: https://lablab.ai/ai-hackathons/nativebuilder-build-without-limits
2. Click "Submit Project"
3. Fill in all required fields
4. Upload demo video
5. Add URLs
6. Submit before **Aug 10, 8:00 PM PST**

---

## 🎯 **Credit Usage Summary**

| Phase | Credits Used | Time |
|-------|--------------|------|
| Initial prompt | 5-8 | 5 mins |
| API integration | 3-5 | 10 mins |
| UI refinements (3x) | 6-9 | 30 mins |
| Debug iterations (2x) | 4-6 | 20 mins |
| Final polish | 3-5 | 15 mins |
| **Total** | **21-33** | **~80 mins** |

**You have 50 credits. Plenty of buffer! ✅**

---

## 🚨 **Troubleshooting Checklist**

### **Backend Issues:**
- [ ] Backend URL is live (`curl https://backend-url/health`)
- [ ] Environment variables are set (AIMLAPI_KEY, MODEL_NAME)
- [ ] CORS is enabled (check main.py)
- [ ] Endpoints return expected JSON

### **Frontend Issues:**
- [ ] Backend URL is correct in Native.Builder config
- [ ] WebSocket uses `wss://` not `ws://`
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful API calls

### **Integration Issues:**
- [ ] Test backend with curl first
- [ ] Verify session_id is being passed correctly
- [ ] Check WebSocket connection in browser DevTools
- [ ] Confirm message format matches what frontend expects

---

## ✅ **Final Checklist Before Submission**

- [ ] Backend deployed and live
- [ ] Frontend deployed and live
- [ ] Full flow tested (idea → boardroom → dossier)
- [ ] Demo video recorded (under 3 mins)
- [ ] GitHub repo is public
- [ ] README.md updated with instructions
- [ ] All URLs working
- [ ] Submission form completed
- [ ] Submitted before deadline

---

## 💡 **Pro Tips**

1. **Save credits:** Test with your deployed backend URL, not mock data
2. **Be specific:** More detailed prompts = better results, fewer iterations
3. **Test early:** Deploy backend FIRST, then build frontend
4. **Use preview:** Native.Builder preview = free testing
5. **Monitor usage:** Check AI/ML API balance regularly
6. **Have backups:** Record demo early in case of last-minute issues

---

## 🆘 **Need Help?**

- **Native.Builder Issues:** https://discord.gg/uP2TQVtkRj
- **Hackathon Questions:** https://discord.gg/lablabai
- **AI/ML API Support:** https://docs.aimlapi.com/

---

**You've got this! 🚀**

Timeline: 6 days left → Plenty of time
Credits: 50 → More than enough
Code: 75% done → Just need frontend
