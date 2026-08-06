import json
from langchain_openai import ChatOpenAI


class FinanceAgent:
    """CFO - reviews financial viability and challenges unrealistic plans"""
    
    def __init__(self, api_key: str, model_name: str = "gpt-4o-mini"):
        self.llm = ChatOpenAI(
            model=model_name,
            openai_api_key=api_key,
            openai_api_base="https://api.aimlapi.com/v1",
            temperature=0.8,  # Higher temp for more critical thinking
            default_headers={
                "HTTP-Referer": "https://github.com/yourusername/day-one",
                "X-Title": "Day One - AI Startup Validator"
            }
        )
        
    async def review_financials(self, context: dict) -> dict:
        """Review the product plan from a financial perspective"""
        prompt = f"""You are a skeptical CFO reviewing a startup plan.

The product team proposed:
- MVP Features: {context['mvp_scope']}
- Tech Stack: {context['tech_stack']}
- Target Audience: {context['target_audience']}
- Value Prop: {context['unique_value_prop']}

Your job:
1. Find ONE major financial red flag (cost, scalability, monetization, or market risk)
2. Challenge it constructively with a specific alternative
3. Suggest a revenue model with concrete pricing

Be specific and constructive. Focus on viability, not just criticism.

Return ONLY valid JSON in this exact format:
{{
    "revenue_model": "Specific pricing model (e.g., $29/month SaaS, transaction fee model, etc.)",
    "challenge": {{
        "target": "mvp_scope OR tech_stack OR market_approach",
        "reason": "Specific financial concern with numbers/data if possible",
        "alternative": "Concrete alternative approach that reduces risk/cost"
    }}
}}"""

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
