from app.agents.base import BaseAgent


class ProductAgent(BaseAgent):
    """Product manager - defines MVP scope and technical architecture"""

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

        fallback = {
            "mvp_scope": ["Core feature scoping unavailable — using fallback"],
            "tech_stack": ["Next.js", "FastAPI", "PostgreSQL"],
            "unique_value_prop": "A focused, faster alternative to existing options."
        }
        return await self._call_json(
            prompt,
            required_keys={"mvp_scope", "tech_stack", "unique_value_prop"},
            fallback=fallback
        )
