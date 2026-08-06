# Native.Builder Master Prompt

## 🎯 **Copy and Paste This ENTIRE Prompt into Native.Builder**

---

## **Project: Day One - AI Startup Validation Platform**

Build a cinematic startup validation platform where founders submit their ideas and watch 6 AI agents debate the viability in real-time, like a boardroom meeting.

---

## **1. LANDING PAGE**

Create a dark, professional landing page with:

### **Hero Section:**
- **Headline:** "Turn Your Startup Idea Into a Validated Business Plan"
- **Subheadline:** "Watch 6 AI experts analyze, challenge, and refine your idea in real-time"
- **Call-to-action:** Large button "Enter the Boardroom" (primary color: #6366f1)

### **How It Works (3 Steps):**
1. **Submit Your Idea** - Tell us what problem you're solving
2. **Watch the Boardroom** - 6 AI agents debate your plan live
3. **Get Your Dossier** - Receive a comprehensive validation report

### **Features Grid (3 Columns):**
- **🔍 Market Research** - Competitor analysis and market sizing
- **💡 Product Strategy** - MVP scope and tech stack recommendations
- **💰 Financial Validation** - Revenue models and cost analysis
- **⚖️ Legal Review** - Compliance requirements and risk assessment
- **📢 Marketing Plan** - Go-to-market strategy and positioning
- **👔 CEO Decision** - Final strategic direction and conflict resolution

### **Input Form:**
- Large textarea placeholder: "Describe your startup idea (What problem are you solving? Who is your target customer?)"
- Character counter showing: "Recommended: 100-300 words"
- Primary button: "Start Analysis" (disabled until >50 characters entered)

### **Design Specs:**
- Background: Dark navy gradient (#0a0e27 to #1a1f3a)
- Text: White with subtle blue glow on headers
- Accent color: Indigo (#6366f1)
- Font: Modern sans-serif (Inter or similar)
- Subtle animated background particles/grid
- Smooth scroll animations

---

## **2. LIVE BOARDROOM VIEW**

After submitting, navigate to `/boardroom/{session_id}` showing:

### **Agent Avatars (Top Section):**
Display 6 agent cards in a grid (2 rows x 3 columns):

1. **Research Agent** 🔍
   - Avatar: Blue circular icon
   - Label: "Market Research"
   - Status indicator: Active/Waiting/Complete

2. **Product Agent** 💡
   - Avatar: Purple circular icon
   - Label: "Product Strategy"
   - Status indicator

3. **Finance Agent** 💰
   - Avatar: Green circular icon
   - Label: "Financial Analysis"
   - Status indicator + "CHALLENGER" badge

4. **Legal Agent** ⚖️
   - Avatar: Gold circular icon
   - Label: "Legal Counsel"
   - Status indicator + "CHALLENGER" badge

5. **Marketing Agent** 📢
   - Avatar: Pink circular icon
   - Label: "Marketing"
   - Status indicator

6. **CEO Agent** 👔
   - Avatar: Red circular icon
   - Label: "CEO Decision"
   - Status indicator

### **Progress Bar:**
- Show current step: "Research analyzing..." / "Finance challenging..." / etc.
- Animated progress (0-100%)
- Estimated time remaining

### **Live Message Feed (Main Section):**
- Terminal-style scrolling message display
- Each message shows:
  - Agent icon + name
  - Timestamp
  - Message content with syntax highlighting
  - Message type indicator (info/challenge/resolution)

**Message Types:**
- **INFO** (white text): Regular agent output
- **CHALLENGE** (yellow/red background): When Finance/Legal raise concerns
- **RESOLUTION** (green background): When CEO makes decisions

### **Action Buttons (Bottom):**
- "View Current Analysis" - Shows partial results
- "Download Transcript" - Export all messages
- Auto-scroll toggle for message feed

### **Design Specs:**
- Dark background (#0f1116)
- Glowing agent avatars when active
- Pulse animation on speaking agent
- Smooth message fade-in animations
- Code-style monospace font for messages
- Subtle ambient background animation

---

## **3. COMPANY DOSSIER PAGE**

After analysis completes, show `/dossier/{session_id}`:

### **Hero Section:**
- **Elevator Pitch** (large, centered, quotation marks)
- Share buttons (Twitter, LinkedIn, Copy Link)
- "Export PDF" button

### **Executive Summary (Cards Grid):**
Four cards showing:
1. **Problem Statement** - What problem this solves
2. **Target Audience** - Who the customers are
3. **Market Size** - Market opportunity
4. **Unique Value Prop** - Key differentiation

### **MVP Scope Section:**
- Title: "Recommended MVP Features"
- Numbered list of features (from API response)
- Each feature as a card with checkmark icon

### **Tech Stack Section:**
- Title: "Recommended Technology Stack"
- Tech stack items as pills/badges
- Organized by layer (Frontend, Backend, Database, etc.)

### **Competitive Landscape:**
- Title: "Competitor Analysis"
- List of competitors with brief descriptions
- Visual comparison table

### **Financial Model:**
- Title: "Revenue Strategy"
- Revenue model description
- Pricing structure recommendations

### **Challenges & Resolutions:**
- Title: "Boardroom Debates"
- Expandable sections for each challenge:
  - **Finance Challenge:** Show concern + resolution
  - **Legal Challenge:** Show concern + resolution
- Color-coded: Challenge (yellow), Resolution (green)

### **Legal & Compliance:**
- Recommended legal structure
- Compliance requirements checklist
- Risk mitigation strategies

### **Go-to-Market Strategy:**
- Marketing strategy summary
- Target channels list
- Customer acquisition approach

### **Next Steps (CTA):**
- "Start Another Analysis" button
- "Download Full Report" button
- "Share on Social" buttons

### **Design Specs:**
- Clean, professional layout
- White/light background for readability
- Sections separated by subtle dividers
- Print-friendly styling
- Responsive for mobile
- Smooth expand/collapse animations

---

## **4. BACKEND INTEGRATION (CRITICAL)**

**IMPORTANT: This app connects to a CUSTOM FASTAPI BACKEND, not built in Native.Builder.**

### **API Configuration:**

**Base URL:** You'll provide this after backend deployment
Format: `https://your-backend-url.com`

**Endpoints to integrate:**

1. **POST /api/analyze**
   - Purpose: Start new analysis
   - Request body:
     ```json
     {
       "idea": "string (user's startup idea)"
     }
     ```
   - Response:
     ```json
     {
       "session_id": "uuid-string",
       "status": "started",
       "message": "Analysis started"
     }
     ```
   - Action: Save session_id, redirect to boardroom view

2. **WebSocket /ws/{session_id}**
   - Purpose: Real-time agent messages
   - Connect after starting analysis
   - Message format:
     ```json
     {
       "agent": "research" | "product" | "finance" | "legal" | "marketing" | "ceo",
       "message": "string",
       "timestamp": "ISO datetime",
       "type": "info" | "challenge" | "resolution"
     }
     ```
   - Action: Display messages in live feed, update agent status

3. **GET /api/result/{session_id}**
   - Purpose: Get final dossier
   - Response:
     ```json
     {
       "session_id": "uuid",
       "status": "completed" | "running" | "error",
       "dossier": {
         "idea": "string",
         "problem_statement": "string",
         "target_audience": "string",
         "competitors": ["string"],
         "unique_value_prop": "string",
         "mvp_scope": ["string"],
         "tech_stack": ["string"],
         "revenue_model": "string",
         "legal_structure": "string",
         "compliance_requirements": ["string"],
         "marketing_strategy": "string",
         "target_channels": ["string"],
         "challenges": [
           {
             "raised_by": "string",
             "target": "string",
             "reason": "string",
             "resolution": "string"
           }
         ],
         "elevator_pitch": "string"
       },
       "messages": [array of agent messages]
     }
     ```
   - Action: Display in dossier page

### **Error Handling:**
- If API fails, show user-friendly error message
- Provide "Try Again" button
- Log errors to console for debugging
- Handle timeout scenarios (analysis >5 mins)

### **Loading States:**
- Show skeleton loaders while API responds
- Animated progress indicators
- "Analyzing..." states with pulsing icons

---

## **5. ROUTING**

Set up these routes:
- `/` - Landing page
- `/boardroom/:sessionId` - Live analysis view
- `/dossier/:sessionId` - Final results
- `/404` - Error page for invalid sessions

---

## **6. STATE MANAGEMENT**

Manage these states:
- `currentSessionId` - Active session UUID
- `analysisStatus` - "idle" | "running" | "completed" | "error"
- `agentMessages` - Array of messages from WebSocket
- `dossierData` - Final analysis results
- `connectionStatus` - WebSocket connection state

---

## **7. RESPONSIVE DESIGN**

Ensure mobile-friendly:
- Landing page: Stack sections vertically
- Boardroom: 3x2 grid becomes 2x3 on mobile
- Dossier: Single column layout on mobile
- Touch-friendly buttons (min 44px height)
- Readable font sizes (min 16px body)

---

## **8. ADDITIONAL FEATURES**

### **Nice-to-Have (if credits allow):**
- Dark/light mode toggle
- Animation preferences (reduce motion option)
- Session history (localStorage)
- Share on social media with preview card
- Copy link functionality
- Confetti animation on analysis complete
- Sound effects for agent transitions (optional, toggle-able)

---

## **9. ACCESSIBILITY**

- Proper heading hierarchy (h1, h2, h3)
- Alt text for all icons/images
- Keyboard navigation support
- ARIA labels for interactive elements
- Sufficient color contrast (WCAG AA)
- Screen reader friendly

---

## **10. TECHNICAL NOTES FOR NATIVE.BUILDER**

- Use WebSocket for real-time updates (not polling)
- Handle WebSocket reconnection on disconnect
- Store session_id in URL params for shareable links
- Use localStorage to cache recent sessions
- Implement optimistic UI updates
- Add CORS handling for API calls
- Use environment variables for API URL (configurable for dev/prod)

---

## **DEPLOYMENT CONFIGURATION**

When ready to deploy:
- Set environment variable: `BACKEND_URL=https://your-actual-backend.com`
- Enable HTTPS
- Configure custom domain (optional)
- Set up error monitoring
- Enable analytics (optional)

---

## **SUMMARY FOR NATIVE.BUILDER**

This is a **3-page application** (Landing → Boardroom → Dossier) that:
1. Takes user input (startup idea)
2. Calls external FastAPI backend
3. Shows real-time updates via WebSocket
4. Displays comprehensive analysis results

**Key Focus Areas:**
- Cinematic, professional UI/UX
- Real-time WebSocket integration
- Responsive design
- External API connection (NOT built in Native.Builder)

**Design Style:**
- Dark, modern, tech-forward
- Boardroom/executive aesthetic
- Smooth animations
- Professional typography
- Trust-building visuals

---

## **END OF PROMPT**

**Next Step:** After generating, provide the backend URL to configure API integration.
