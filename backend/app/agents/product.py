import json
from langchain_openai import ChatOpenAI


class ProductAgent:
    """Product manager - defines MVP scope and technical architecture"""
    
    def __init__(self, api_key: str, model_name: str = "gpt-4o-mini"):
        self.llm = ChatOpenAI(
            model=model_name,
            openai_api_key=api_key,
            openai_api_base="https://api.aimlapi.com/v1",
            temperature=0.7,
            default_headers={
                "HTTP-Referer": "https://github.com/yourusername/day-one",
                "X-Title": "Day One - AI Startup Validator"
            }
        )
        
    async def design_mvp(self, context: dict) -> dict:
        """Design the MVP based on market research"""
        prompt = f"""You are a product manager designing an MVP for a startup.

Based on this research:
- Problem: {context['problem_statement']}
- Audience: {context['target_audience']}
- Competitors: {', '.join(context['competitors'])}

Define:
1. MVP Scope (3-5 core features that differentiate from competitors)
2. Tech Stack (be specific: frontend framework, backend, database, key services)
3. Unique Value Proposition (1 sentence - what makes this clearly different/better)

Return ONLY valid JSON in this exact format:
{{
    "mvp_scope": ["Feature 1 with brief detail", "Feature 2 with brief detail", "Feature 3 with brief detail"],
    "tech_stack": ["Next.js 14", "FastAPI", "PostgreSQL", "Stripe"],
    "unique_value_prop": "One clear sentence about differentiation..."
}}"""

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
