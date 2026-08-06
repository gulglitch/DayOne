from app.agents.base import BaseAgent


class MarketingAgent(BaseAgent):
    """CMO - develops go-to-market strategy and positioning"""

    async def develop_strategy(self, context: dict) -> dict:
        """Develop marketing strategy and positioning"""
        prompt = f"""You are a CMO developing a go-to-market strategy for a startup.

Business Context:
- Problem: {context['problem_statement']}
- Target Audience: {context['target_audience']}
- Value Prop: {context['unique_value_prop']}
- Competitors: {context['competitors']}

Your job:
1. Define a marketing strategy (positioning, key messages, differentiation angle)
2. Identify 3-4 target channels (where to reach customers)
3. Suggest initial customer acquisition approach

Be specific and actionable for a bootstrap startup.

Return ONLY valid JSON in this exact format:
{{
    "marketing_strategy": "Clear positioning and differentiation approach in 2-3 sentences",
    "target_channels": ["Channel 1 - why", "Channel 2 - why", "Channel 3 - why"],
    "acquisition_approach": "Initial strategy to get first 100 customers"
}}"""

        fallback = {
            "marketing_strategy": "Position as the focused, faster alternative for early adopters.",
            "target_channels": ["Organic social", "Community forums", "Direct outreach"],
            "acquisition_approach": "Manual outreach to first 100 users, iterate on feedback."
        }
        return await self._call_json(
            prompt,
            required_keys={"marketing_strategy", "target_channels", "acquisition_approach"},
            fallback=fallback
        )
