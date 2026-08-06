from app.agents.base import BaseAgent


class ResearchAgent(BaseAgent):
    """Market research analyst - analyzes market, competitors, and target audience"""

    async def analyze(self, idea: str) -> dict:
        """Analyze the startup idea and provide market research"""
        prompt = f"""You are a market research analyst for a startup incubator.

Analyze this startup idea: "{idea}"

Provide a structured analysis with:
1. Problem statement (2-3 sentences describing the problem this solves)
2. Target audience (specific demographic/psychographic profile)
3. Top 3 competitors (real companies if possible, include brief description)
4. Market size signal (Small/Medium/Large + brief justification)

Return ONLY valid JSON in this exact format:
{{
    "problem_statement": "Clear problem description...",
    "target_audience": "Specific target customer profile...",
    "competitors": ["Company 1 - description", "Company 2 - description", "Company 3 - description"],
    "market_size": "Medium - justification here"
}}"""

        fallback = {
            "problem_statement": f"Analysis unavailable for \"{idea}\" — using fallback data.",
            "target_audience": "General early adopters",
            "competitors": ["Competitor data unavailable"],
            "market_size": "Medium - fallback estimate"
        }
        return await self._call_json(
            prompt,
            required_keys={"problem_statement", "target_audience", "competitors", "market_size"},
            fallback=fallback
        )
