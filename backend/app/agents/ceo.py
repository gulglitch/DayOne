from app.agents.base import BaseAgent


class CEOAgent(BaseAgent):
    """CEO - makes final decisions and resolves conflicts between departments"""

    def __init__(self, api_key: str, model_name: str = "openrouter/free"):
        super().__init__(api_key, model_name, temperature=0.6)

    async def resolve_conflicts(self, context: dict, challenges: list) -> dict:
        """Make final decisions on challenges raised by other agents"""
        
        # Format challenges for the prompt
        challenges_text = "\n".join([
            f"- {c['agent'].upper()} challenged {c['challenge']['target']}: {c['challenge']['reason']}\n  Suggested: {c['challenge']['alternative']}"
            for c in challenges
        ])
        
        prompt = f"""You are the CEO making final strategic decisions for this startup.

BUSINESS PLAN:
- Idea: {context['idea']}
- MVP: {context['mvp_scope']}
- Revenue: {context.get('revenue_model', 'TBD')}

CHALLENGES RAISED:
{challenges_text}

Your job:
1. For each challenge, decide: ACCEPT (adopt the alternative), REJECT (keep original), or COMPROMISE
2. Provide clear reasoning for each decision
3. If accepting/compromising, specify what changes to make

Balance innovation with pragmatism. Consider market timing, resources, and risk.

Return ONLY valid JSON in this exact format:
{{
    "decisions": [
        {{
            "challenge_from": "finance",
            "decision": "ACCEPT | REJECT | COMPROMISE",
            "reasoning": "Why you made this decision",
            "action": "What changes to implement, or null if rejected"
        }}
    ],
    "revised_mvp": ["Updated feature list if any MVP changes"] or null,
    "final_directive": "Your 2-3 sentence strategic direction for the team"
}}"""

        fallback = {
            "decisions": [
                {
                    "challenge_from": c["agent"],
                    "decision": "COMPROMISE",
                    "reasoning": "CEO review unavailable — defaulting to a balanced compromise.",
                    "action": None
                }
                for c in challenges
            ],
            "revised_mvp": None,
            "final_directive": "Proceed with the current plan while monitoring the flagged risks closely."
        }
        return await self._call_json(
            prompt,
            required_keys={"decisions", "final_directive"},
            fallback=fallback
        )

    async def generate_pitch(self, context: dict) -> str:
        """Generate final elevator pitch"""
        prompt = f"""Create a compelling 2-sentence elevator pitch for this startup:

- Problem: {context['problem_statement']}
- Solution: {context['unique_value_prop']}
- Market: {context['target_audience']}
- Revenue: {context['revenue_model']}

Make it punchy, investor-ready, and memorable. Focus on the transformation/outcome for customers.

Return ONLY the 2-sentence pitch, nothing else."""

        fallback = (
            f"{context.get('idea', 'This startup')} solves a real problem for "
            f"{context.get('target_audience', 'its target users')}. "
            "We're building the fastest path from idea to traction."
        )
        return await self._call_text(prompt, fallback=fallback)
