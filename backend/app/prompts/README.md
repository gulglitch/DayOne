# Agent Prompts Directory

This directory contains the prompt templates for all 6 AI agents. Currently, prompts are **embedded directly in the agent code** for simplicity, but these files serve as:

1. **Documentation** - See exactly what each agent is instructed to do
2. **Version Control** - Track prompt changes over time
3. **Easy Editing** - Modify behavior without touching code
4. **Future Enhancement** - Can be loaded dynamically later

## Current Files

| File | Agent | Purpose |
|------|-------|---------|
| `research_prompt.txt` | Research Agent | Market analysis and competitor research |
| `product_prompt.txt` | Product Agent | MVP definition and tech stack |
| `finance_prompt.txt` | Finance Agent | Revenue model and financial challenges |
| `legal_prompt.txt` | Legal Agent | Legal structure and compliance |
| `marketing_prompt.txt` | Marketing Agent | Go-to-market strategy |
| `ceo_decision_prompt.txt` | CEO Agent | Conflict resolution and decisions |
| `ceo_pitch_prompt.txt` | CEO Agent | Elevator pitch generation |

## How Prompts Work

Each prompt file contains:
- **Role definition** - What persona the agent should adopt
- **Context variables** - Placeholders like `{idea}`, `{mvp_scope}`, etc.
- **Instructions** - Specific tasks and constraints
- **Output format** - Expected JSON structure

### Example: Research Agent

```
You are a market research analyst for a startup incubator.

Analyze this startup idea: "{idea}"

Provide a structured analysis with:
1. Problem statement
2. Target audience
3. Top 3 competitors
4. Market size signal

Return ONLY valid JSON...
```

## Customizing Prompts

### Method 1: Edit the Prompt Files (Current Approach)

The prompts are embedded in the agent code, so edit them there:

**Example - Make Finance Agent More Aggressive:**

Edit `backend/app/agents/finance.py`:

```python
prompt = f"""You are an EXTREMELY skeptical CFO who finds problems in EVERY plan.

The product team proposed:
- MVP Features: {context['mvp_scope']}
...

Find TWO major financial red flags (not just one).
Be brutally honest about why this will fail financially.
"""
```

### Method 2: Load from Files (Future Enhancement)

To load prompts dynamically from these files, modify agents like this:

```python
import os

class ResearchAgent:
    def __init__(self, api_key: str, model_name: str = "openrouter/free"):
        self.llm = ChatOpenAI(...)
        self.prompt_template = self._load_prompt()
    
    def _load_prompt(self):
        prompt_path = os.path.join(os.path.dirname(__file__), '../prompts/research_prompt.txt')
        with open(prompt_path, 'r') as f:
            return f.read()
    
    async def analyze(self, idea: str) -> dict:
        prompt = self.prompt_template.format(idea=idea)
        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
```

## Prompt Engineering Tips

### 1. Be Specific About Output Format

✅ **Good:**
```
Return ONLY valid JSON in this exact format:
{
    "field1": "value",
    "field2": ["item1", "item2"]
}
```

❌ **Bad:**
```
Return some JSON with the results.
```

### 2. Use Clear Role Definitions

✅ **Good:**
```
You are a skeptical CFO who has seen many startups fail due to poor financial planning.
```

❌ **Bad:**
```
You are a finance person.
```

### 3. Provide Examples When Needed

✅ **Good:**
```
Suggest a revenue model with concrete pricing.
Examples: "$29/month SaaS", "5% transaction fee", "$99 one-time purchase"
```

### 4. Set Clear Constraints

✅ **Good:**
```
1. Find ONE major financial red flag
2. Be specific with numbers/data if possible
3. Suggest a concrete alternative
```

### 5. Request Structured Output

✅ **Good:**
```
Return ONLY valid JSON (no markdown, no explanations)
```

❌ **Bad:**
```
Give me the results
```

## Context Variables

Each prompt uses specific variables that get filled in by the pipeline:

### Research Agent
- `{idea}` - The startup idea text

### Product Agent
- `{problem_statement}` - From research
- `{target_audience}` - From research
- `{competitors}` - From research

### Finance Agent
- `{mvp_scope}` - From product
- `{tech_stack}` - From product
- `{target_audience}` - From research
- `{unique_value_prop}` - From product

### Legal Agent
- `{idea}` - Original idea
- `{target_audience}` - From research
- `{mvp_scope}` - From product

### Marketing Agent
- `{problem_statement}` - From research
- `{target_audience}` - From research
- `{unique_value_prop}` - From product
- `{competitors}` - From research

### CEO Agent
- `{idea}` - Original idea
- `{mvp_scope}` - From product
- `{revenue_model}` - From finance
- `{challenges_text}` - Formatted challenges
- `{problem_statement}` - From research

## Testing Prompts

### Quick Test in Python

```python
# Test a prompt with sample data
prompt_template = open('app/prompts/research_prompt.txt').read()
prompt = prompt_template.format(idea="AI meal planning app")
print(prompt)
```

### Test with OpenRouter

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="openrouter/free",
    openai_api_key="your_key",
    openai_api_base="https://openrouter.ai/api/v1"
)

prompt = open('app/prompts/research_prompt.txt').read()
prompt = prompt.format(idea="AI fitness coaching app")

response = llm.invoke(prompt)
print(response.content)
```

## Common Issues & Fixes

### Issue: LLM Returns Non-JSON

**Fix:** Add to prompt:
```
CRITICAL: Return ONLY the JSON object. No markdown code blocks, no explanations before or after.
Start with { and end with }
```

### Issue: Missing Fields in Response

**Fix:** Show exact field names:
```
Required fields (all must be present):
- problem_statement (string)
- target_audience (string)
- competitors (array of 3 strings)
- market_size (string)
```

### Issue: Inconsistent Quality

**Fix:** Add quality criteria:
```
Make each competitor description at least 10 words.
Include specific numbers in market size justification.
```

## Version Control

Track prompt changes with comments:

```
# research_prompt.txt
# v1.0 - Initial version
# v1.1 - Added requirement for 3 competitors (not 2-3)
# v1.2 - Specified minimum description length
```

## Future Enhancements

- [ ] Load prompts from files dynamically
- [ ] Support multiple prompt versions (A/B testing)
- [ ] Add prompt templates with variables
- [ ] Create prompt validation tests
- [ ] Add few-shot examples to prompts
- [ ] Support multi-language prompts

---

**Tip:** Start with the prompts in the code, then move to file-based loading as your needs grow!
