import asyncio
from datetime import datetime
from typing import Callable, Optional
from app.agents.research import ResearchAgent
from app.agents.product import ProductAgent
from app.agents.finance import FinanceAgent
from app.agents.legal import LegalAgent
from app.agents.marketing import MarketingAgent
from app.agents.ceo import CEOAgent
from app.models import CompanyDossier, Challenge


class CompanyPipeline:
    """Orchestrates the 6-agent sequential pipeline"""
    
    def __init__(self, api_key: str, model_name: str = "openrouter/free", websocket_callback: Optional[Callable] = None):
        self.research = ResearchAgent(api_key, model_name)
        self.product = ProductAgent(api_key, model_name)
        self.finance = FinanceAgent(api_key, model_name)
        self.legal = LegalAgent(api_key, model_name)
        self.marketing = MarketingAgent(api_key, model_name)
        self.ceo = CEOAgent(api_key, model_name)
        self.ws_callback = websocket_callback
        
    async def emit_event(self, agent: str, message: str, type: str = "info"):
        """Send real-time update via WebSocket"""
        if self.ws_callback:
            await self.ws_callback({
                "agent": agent,
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
                "type": type
            })
    
    async def run(self, idea: str) -> CompanyDossier:
        """Execute the full 6-agent pipeline"""
        context = {"idea": idea}
        challenges = []
        
        # Step 1: Research Agent
        await self.emit_event("research", "🔍 Analyzing market and competitors...")
        research_data = await self.research.analyze(idea)
        context.update(research_data)
        await self.emit_event(
            "research", 
            f"Found {len(research_data['competitors'])} competitors in {research_data['market_size'].split(' - ')[0]} market"
        )
        
        await asyncio.sleep(0.5)  # Pacing for demo
        
        # Step 2: Product Agent
        await self.emit_event("product", "💡 Designing MVP and tech stack...")
        product_data = await self.product.design_mvp(context)
        context.update(product_data)
        await self.emit_event(
            "product", 
            f"MVP defined: {len(product_data['mvp_scope'])} core features"
        )
        
        await asyncio.sleep(0.5)
        
        # Step 3: Finance Agent (First Challenger!)
        await self.emit_event("finance", "💰 Reviewing financial viability...")
        finance_data = await self.finance.review_financials(context)
        context['revenue_model'] = finance_data['revenue_model']
        
        # Record finance challenge
        challenges.append({
            "agent": "finance",
            "challenge": finance_data['challenge']
        })
        
        await self.emit_event(
            "finance", 
            f"⚠️ CHALLENGE: {finance_data['challenge']['reason']}", 
            type="challenge"
        )
        
        await asyncio.sleep(0.5)
        
        # Step 4: Legal Agent (Second Challenger!)
        await self.emit_event("legal", "⚖️ Assessing legal requirements...")
        legal_data = await self.legal.review_legal(context)
        context['legal_structure'] = legal_data['legal_structure']
        context['compliance_requirements'] = legal_data['compliance_requirements']
        
        # Record legal challenge
        challenges.append({
            "agent": "legal",
            "challenge": legal_data['challenge']
        })
        
        await self.emit_event(
            "legal", 
            f"⚠️ LEGAL RISK: {legal_data['challenge']['reason']}", 
            type="challenge"
        )
        
        await asyncio.sleep(0.5)
        
        # Step 5: Marketing Agent
        await self.emit_event("marketing", "📢 Developing go-to-market strategy...")
        marketing_data = await self.marketing.develop_strategy(context)
        context['marketing_strategy'] = marketing_data['marketing_strategy']
        context['target_channels'] = marketing_data['target_channels']
        
        await self.emit_event(
            "marketing", 
            f"Strategy: {len(marketing_data['target_channels'])} target channels identified"
        )
        
        await asyncio.sleep(1)  # Dramatic pause before CEO
        
        # Step 6: CEO Agent (Resolver)
        await self.emit_event("ceo", "👔 CEO reviewing all inputs and making final decisions...")
        ceo_data = await self.ceo.resolve_conflicts(context, challenges)
        
        await self.emit_event(
            "ceo",
            f"✓ DECISIONS MADE: {ceo_data['final_directive']}",
            type="resolution"
        )
        
        # Generate elevator pitch
        elevator_pitch = await self.ceo.generate_pitch(context)
        
        # Compile final dossier
        dossier_challenges = []
        for i, ch in enumerate(challenges):
            decision = ceo_data['decisions'][i] if i < len(ceo_data['decisions']) else None
            dossier_challenges.append(Challenge(
                raised_by=ch['agent'],
                target=ch['challenge']['target'],
                reason=ch['challenge']['reason'],
                resolution=decision['reasoning'] if decision else None
            ))
        
        # Use revised MVP if CEO made changes, otherwise use original
        final_mvp = ceo_data.get('revised_mvp') or context['mvp_scope']
        
        dossier = CompanyDossier(
            idea=idea,
            problem_statement=context['problem_statement'],
            target_audience=context['target_audience'],
            competitors=context['competitors'],
            unique_value_prop=context['unique_value_prop'],
            mvp_scope=final_mvp,
            tech_stack=context['tech_stack'],
            revenue_model=context['revenue_model'],
            legal_structure=context['legal_structure'],
            compliance_requirements=context['compliance_requirements'],
            marketing_strategy=context['marketing_strategy'],
            target_channels=context['target_channels'],
            challenges=dossier_challenges,
            elevator_pitch=elevator_pitch
        )
        
        await self.emit_event(
            "ceo",
            "✅ Company dossier complete!",
            type="info"
        )
        
        return dossier
