import json
from langchain_openai import ChatOpenAI


class LegalAgent:
    """Legal counsel - identifies compliance requirements and legal risks"""
    
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
        
    async def review_legal(self, context: dict) -> dict:
        """Review legal and compliance requirements"""
        prompt = f"""You are a startup legal advisor reviewing a business plan.

Business Context:
- Idea: {context['idea']}
- Target Audience: {context['target_audience']}
- MVP Features: {context['mvp_scope']}

Your job:
1. Recommend a legal structure (LLC, C-Corp, etc.) with brief reasoning
2. Identify 2-3 key compliance requirements (GDPR, CCPA, industry regulations, etc.)
3. Flag ONE potential legal risk that could derail the business

Be practical and startup-focused. Don't over-complicate.

Return ONLY valid JSON in this exact format:
{{
    "legal_structure": "Entity type - brief reasoning",
    "compliance_requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
    "challenge": {{
        "target": "data_privacy OR intellectual_property OR liability OR regulatory",
        "reason": "Specific legal concern",
        "alternative": "Mitigation strategy or alternative approach"
    }}
}}"""

        response = await self.llm.ainvoke(prompt)
        return json.loads(response.content)
