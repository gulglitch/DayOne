import json
from langchain_openai import ChatOpenAI


class ResearchAgent:
    """Market research analyst - analyzes market, competitors, and target audience"""
    
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

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
