# Quick Guide: Customizing Agent Behavior

Want to change how the agents think? Here's how!

## 🎯 Common Customizations

### 1. Make Finance Agent More Critical

Edit `backend/app/agents/finance.py`, line ~25:

**Change from:**
```python
Your job:
1. Find ONE major financial red flag
```

**To:**
```python
Your job:
1. Find TWO major financial red flags (scalability AND monetization)
2. Be brutally honest - most startups fail due to poor unit economics
```

### 2. Add More Competitors to Research

Edit `backend/app/agents/research.py`, line ~25:

**Change from:**
```python
3. Top 3 competitors (real companies if possible, include brief description)
```

**To:**
```python
3. Top 5 competitors (mix of direct and indirect competitors, include brief description and funding status)
```

Don't forget to update the JSON format:
```python
"competitors": ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"]
```

### 3. Make CEO More Conservative

Edit `backend/app/agents/ceo.py`, line ~35:

**Add to prompt:**
```python
IMPORTANT: You are risk-averse. Default to ACCEPT challenges from Finance and Legal.
Only REJECT if the challenge fundamentally undermines the core value proposition.
```

### 4. Focus Marketing on Specific Channels

Edit `backend/app/agents/marketing.py`, line ~25:

**Add to prompt:**
```python
Focus on digital-first, low-cost channels suitable for bootstrap startups.
Prioritize: Content marketing, SEO, social media, partnerships.
Avoid: Paid advertising, traditional media, events (too expensive for MVP stage).
```

### 5. Add Industry-Specific Legal Requirements

Edit `backend/app/agents/legal.py`, line ~25:

**Add to prompt:**
```python
If the startup handles payments, ALWAYS flag PCI-DSS compliance.
If it involves health data, ALWAYS flag HIPAA compliance.
If targeting EU, ALWAYS flag GDPR compliance.
```

## 🔧 Advanced Customizations

### Change Temperature (Creativity)

In any agent file, change temperature:

```python
self.llm = ChatOpenAI(
    model=model_name,
    temperature=0.9,  # Higher = more creative (0.0-1.0)
    ...
)
```

**Guidelines:**
- `0.0-0.3` - Focused, consistent, factual (good for Legal)
- `0.4-0.7` - Balanced (good for Product, Research)
- `0.8-1.0` - Creative, varied (good for Marketing, CEO)

### Add Reasoning Steps

Make agents show their thinking:

```python
prompt = f"""...

Before providing your final answer, think through:
1. What are the key risks?
2. What assumptions am I making?
3. What alternatives exist?

Then provide your final JSON output.
"""
```

### Add Examples (Few-Shot Learning)

```python
prompt = f"""...

Example good output:
{{
    "revenue_model": "Freemium SaaS: Free for 3 users, $29/month for teams up to 10, $99/month unlimited",
    "challenge": {{
        "target": "tech_stack",
        "reason": "PostgreSQL will cost $50-200/month at scale, eating 20-40% of early revenue",
        "alternative": "Start with SQLite/Turso for first 1000 users (free), migrate to managed Postgres only after $5k MRR"
    }}
}}

Now analyze this startup:
...
"""
```

## 🎨 Personality Tweaks

### Make Agents More Conversational

Add personality to prompts:

```python
# Finance Agent
"You are a friendly but skeptical CFO who has seen it all. Use phrases like 'I've seen this before' and 'Here's what usually happens...'"

# Marketing Agent  
"You are an enthusiastic CMO who gets excited about creative campaigns. Use energetic language."

# Legal Agent
"You are a pragmatic startup lawyer who avoids legal jargon. Explain risks like you're talking to a founder friend."
```

### Add Domain Expertise

```python
# For SaaS startups
"You specialize in SaaS businesses and know the 'rule of 40', LTV:CAC ratios, and ARR benchmarks."

# For marketplace startups
"You specialize in two-sided marketplaces and understand the chicken-and-egg problem, take rates, and network effects."
```

## 📊 Output Format Changes

### Add More Fields

Edit both the prompt AND the model:

**1. Update prompt in agent:**
```python
{{
    "revenue_model": "...",
    "projected_runway": "Estimated months until profitability",
    "key_assumptions": ["Assumption 1", "Assumption 2"]
}}
```

**2. Update model in `backend/app/models.py`:**
```python
class CompanyDossier(BaseModel):
    # existing fields...
    projected_runway: Optional[str] = None
    key_assumptions: Optional[List[str]] = None
```

### Change JSON Structure

Want nested objects? Update prompts:

```python
{{
    "challenge": {{
        "category": "financial",
        "severity": "high",
        "details": {{
            "issue": "...",
            "impact": "...",
            "mitigation": "..."
        }}
    }}
}}
```

## 🧪 Testing Your Changes

### 1. Test Single Agent

```python
# test_single_agent.py
import asyncio
from app.agents.finance import FinanceAgent
from dotenv import load_dotenv
import os

load_dotenv()

async def test():
    agent = FinanceAgent(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        model_name="openrouter/free"
    )
    
    result = await agent.review_financials({
        "mvp_scope": ["Feature 1", "Feature 2"],
        "tech_stack": ["Next.js", "FastAPI", "PostgreSQL"],
        "target_audience": "Busy professionals",
        "unique_value_prop": "AI-powered automation"
    })
    
    print(result)

asyncio.run(test())
```

### 2. Test Full Pipeline

Just run a normal analysis and check the output.

## 💡 Pro Tips

1. **Start Small** - Change one thing at a time
2. **Test Quickly** - Use the test script above
3. **Track Changes** - Comment your changes in the code
4. **Compare Outputs** - Run the same idea before/after changes
5. **Check JSON** - Make sure output is still valid JSON

## 🚨 Common Mistakes

❌ **Breaking JSON format** - Always test that output is valid JSON
❌ **Too many instructions** - Keep prompts focused
❌ **Vague requirements** - Be specific about what you want
❌ **Forgetting to update models** - New fields need to be in `models.py`
❌ **Temperature too high** - Can cause inconsistent output

## 📝 Quick Reference

| File | What to Edit | Common Changes |
|------|-------------|----------------|
| `agents/research.py` | Market analysis | Number of competitors, market depth |
| `agents/product.py` | MVP scope | Feature count, tech preferences |
| `agents/finance.py` | Financial scrutiny | Challenge severity, pricing guidance |
| `agents/legal.py` | Legal risk | Industry focus, risk tolerance |
| `agents/marketing.py` | GTM strategy | Channel preferences, acquisition |
| `agents/ceo.py` | Decision style | Risk appetite, leadership tone |

---

**Ready to customize?** Start with small changes and test often! 🚀
