from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class IdeaInput(BaseModel):
    idea: str
    target_market: Optional[str] = None


class AgentMessage(BaseModel):
    agent: str
    message: str
    timestamp: datetime
    type: str  # "info" | "challenge" | "resolution"


class Challenge(BaseModel):
    raised_by: str
    target: str
    reason: str
    resolution: Optional[str] = None


class CompanyDossier(BaseModel):
    idea: str
    problem_statement: str
    target_audience: str
    competitors: List[str]
    unique_value_prop: str
    mvp_scope: List[str]
    tech_stack: List[str]
    revenue_model: str
    legal_structure: str
    compliance_requirements: List[str]
    marketing_strategy: str
    target_channels: List[str]
    challenges: List[Challenge]
    elevator_pitch: str


class SessionState(BaseModel):
    session_id: str
    status: str  # "running" | "completed" | "error"
    messages: List[AgentMessage]
    dossier: Optional[CompanyDossier] = None
    created_at: datetime
