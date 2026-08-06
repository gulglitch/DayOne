import json
from langchain_openai import ChatOpenAI


class MarketingAgent:
    """CMO - develops go-to-market strategy and positioning"""
    
    def __init__(self, api_key: str, model_name: str = "openrouter/free"):
        self.llm = ChatOpenAI(
            model=model_name,
            openai_api_key=api_key,
            openai_api_base="https://openrouter.ai/api/v1",
            temperature=0.7,
            default_headers={
                "HTTP-Referer": "https://github.com/yourusername/day-one",
                "X-Title": "Day One - AI Startup Validator"
            }
        )
        
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

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
