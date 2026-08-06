from app.agents.base import BaseAgent


class LegalAgent(BaseAgent):
    """Legal counsel - identifies compliance requirements and legal risks"""

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

        fallback = {
            "legal_structure": "Delaware C-Corp - standard for startups seeking investment",
            "compliance_requirements": ["Privacy policy", "Terms of service", "Data handling review"],
            "challenge": {
                "target": "data_privacy",
                "reason": "Legal review unavailable — flagging data privacy as a placeholder risk.",
                "alternative": "Run a compliance review before collecting user data at scale."
            }
        }
        return await self._call_json(
            prompt,
            required_keys={"legal_structure", "compliance_requirements", "challenge.target", "challenge.reason", "challenge.alternative"},
            fallback=fallback
        )
