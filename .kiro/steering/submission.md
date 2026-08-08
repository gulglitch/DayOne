# Day One - Hackathon Submission Requirements

## Event: AI Factory - Native.builder Hackathon
- **Deadline**: August 10, 2026, 8:00 PM PST
- **Platform**: lablab.ai
- **Event URL**: https://lablab.ai/ai-hackathons/nativebuilder-build-without-limits

## Submission Checklist

### ✅ Required Deliverables

#### 1. Project Information
- [ ] **Clear Problem Statement**: What problem does Day One solve?
  - *Startup validation is time-consuming and expensive. Founders need rapid, structured feedback before investing resources.*
- [ ] **Target User Definition**: Who is this for?
  - *Aspiring founders, entrepreneurs, startup accelerators, and business idea validators*
- [ ] **Native.builder Usage Explanation**: How was native.builder used?
  - *Note: Day One was NOT built with native.builder - it's a custom FastAPI + Next.js stack. This needs to be addressed.*

#### 2. Demonstration
- [ ] **Video Demo**: Maximum 3 minutes
  - Must show at least ONE complete end-to-end workflow
  - Recommended workflow: Submit idea → Watch agents debate → Receive dossier
  - Should highlight real-time agent streaming (WebSocket feature)
- [ ] **Live Application**: Publicly accessible URL
  - Must be deployed and functional for judges
  - No accounts/authentication required for judges to test

#### 3. Application and Tools
- [ ] **Application URL**: Publicly accessible deployment
- [ ] **Native.builder Project URL**: Link to native.builder project (if applicable)
- [ ] **Technology List**: Document all external APIs, datasets, and tools
  - OpenAI SDK / AI/ML API
  - FastAPI
  - Next.js 16
  - WebSockets
  - Docker

### ⚠️ Critical Eligibility Requirements

#### Must Have:
- ✅ **Created during hackathon period**: August 3-10, 2026
- ⚠️ **Created primarily using native.builder**: *Day One was NOT built with native.builder*
- ✅ **Demonstrates meaningful use**: Yes - full multi-agent system
- ✅ **Not just a landing page**: Yes - full application with AI agents
- ✅ **Accessible to judges**: Must ensure deployment is public
- ✅ **Original work**: Yes - custom implementation

#### Must NOT Be:
- ❌ Inaccessible to judging team
- ❌ Primarily built outside native.builder (*This is a concern*)
- ❌ Direct copy of existing product
- ❌ Submitted without working demonstration

## ⚠️ CRITICAL ISSUE: Native.builder Requirement

**Day One was built with FastAPI + Next.js, NOT native.builder.**

### Options:
1. **Cannot submit** to this hackathon (native.builder is mandatory)
2. **Rebuild with native.builder** (time-consuming, deadline approaching)
3. **Submit and explain** (likely ineligible but worth documenting the attempt)
4. **Find a different hackathon** that accepts custom stacks

## Judging Criteria (Scoring Dimensions)

### 1. Application of Technology (25%)
- How effectively are AI models integrated?
- Day One strengths:
  - 6 specialized AI agents with distinct personalities
  - Adversarial validation (Finance/Legal challenge, CEO resolves)
  - Real-time streaming with WebSockets
  - JSON parsing with retry and fallback logic

### 2. Presentation (25%)
- Clarity and effectiveness of project presentation
- Focus areas:
  - Show live agent debate in action
  - Highlight real-time streaming
  - Demonstrate final dossier quality
  - Explain adversarial validation concept

### 3. Business Value (25%)
- Practical impact and business fit
- Day One strengths:
  - Solves real problem: startup validation is expensive and slow
  - Clear target market: founders, accelerators
  - Time-saving value proposition
  - Reduces cost of early-stage validation

### 4. Originality (25%)
- Uniqueness and creativity
- Day One strengths:
  - Adversarial AI collaboration (not just consensus)
  - C-suite simulation approach
  - Real-time "boardroom" experience
  - Multi-agent debate system

## Technology Stack Documentation

### Core Stack
- **Backend**: Python 3.11+, FastAPI, OpenAI SDK
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4
- **Real-time**: WebSockets for agent streaming
- **AI Models**: OpenAI via AI/ML API endpoint (OpenRouter-compatible)
- **Deployment**: Docker-based (docker-compose)

### External Services Used
- **AI/ML API**: LLM inference for 6 agents
- **OpenAI SDK**: Direct API integration
- **Pydantic**: Data validation
- **Vercel** (optional): Frontend deployment

## Partner Tool Integration Opportunities

### Available Partner Credits (First-Come, First-Served)

#### AI/ML API
- **Credits**: $10 per participant (up to 500)
- **Current Use**: Already using AI/ML API for LLM calls
- **Action**: Claim coupon at https://lablab.ai/redeem-coupon/ai-ml-api-coupon-nativebuilder-hackathon
- **Eligibility**: Can claim OR Featherless (not both)

#### Featherless AI
- **Credits**: $25 per participant (up to 500)
- **Potential Use**: Could add open-source model agents
- **Action**: Claim at https://lablab.ai/redeem-coupon/featherless-ai-coupon-nativebuilder-hackathon
- **Eligibility**: Can claim OR AI/ML API (not both)

#### Speechmatics
- **Credits**: $50 per participant (up to 100)
- **Potential Use**: Could add voice input for startup ideas
- **Promo Code**: LABLABHACKATHON50
- **Action**: Sign up and enter promo code

#### Bright Data
- **Credits**: $50 per participant (unlimited)
- **Potential Use**: Could add market research data scraping
- **Promo Code**: aiaccess50
- **Bonus**: 5,000 free MCP requests/month

### Partner Prize Opportunities

#### AI/ML API Challenge
- **Prize**: $1,000 in AI/ML API Credits
- **Criteria**: Best use of AI/ML API
- **Day One Advantage**: Already using AI/ML API for all 6 agents

#### Featherless AI Challenge
- **Prize**: $300 in Featherless Credits
- **Criteria**: Best use of Featherless AI
- **Requires**: Integration of Featherless AI

#### Speechmatics Challenge
- **Prize**: 500 API credits (Top 3 projects)
- **Requires**: Integration of Speechmatics

#### Bright Data Challenge
- **Prize**: $500 cash + $500 credits
- **Criteria**: Best agentic use of Bright Data
- **Requires**: Integration of Bright Data

## Ownership and Licensing

- **Ownership**: Day One team retains full ownership
- **Submissions**: Must be MIT-compliant
- **Assets**: Must have permission for all datasets, APIs, and IP used
- **License**: Open-source components must comply with their licenses

## Submission Platform

- **Portal**: lablab.ai submission form
- **Account**: Team leader must submit
- **Timing**: Before August 10, 2026, 8:00 PM PST
- **Confirmation**: Wait for submission confirmation email

## Post-Submission

- **Prize Distribution**: May take up to 90 days
- **Judging Period**: After deadline
- **Results**: Announced via lablab.ai platform
- **Live Results**: https://lablab.ai/ai-hackathons/nativebuilder-build-without-limits/live

## Key Links

- **Submit Project**: Via lablab.ai platform (after registration)
- **Event Discord**: https://discord.gg/lablabai
- **NativelyAI Discord**: https://discord.gg/uP2TQVtkRj
- **Event Page**: https://lablab.ai/ai-hackathons/nativebuilder-build-without-limits
