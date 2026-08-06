from app.agents.base import BaseAgent


class FinanceAgent(BaseAgent):
    """CFO - reviews financial viability and challenges unrealistic plans"""

    def __init__(self, api_key: str, model_name: str = "openrouter/free"):
        super().__init__(api_key, model_name, temperature=0.8)  # Higher temp for more critical thinking

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

        fallback = {
            "revenue_model": "Freemium with a $19/month paid tier - fallback estimate",
            "challenge": {
                "target": "mvp_scope",
                "reason": "Financial review unavailable — flagging cost risk as a placeholder challenge.",
                "alternative": "Validate unit economics before building beyond the core feature."
            }
        }
        return await self._call_json(
            prompt,
            required_keys={"revenue_model", "challenge.target", "challenge.reason", "challenge.alternative"},
            fallback=fallback
        )
