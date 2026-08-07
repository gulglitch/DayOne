export type MessageType = "info" | "challenge" | "resolution" | "error";

export interface AgentMessage {
  agent: string;
  message: string;
  timestamp: string;
  type: MessageType;
}

export interface PingEvent {
  type: "ping";
}

export type WSEvent = AgentMessage | PingEvent;

export interface AnalyzeResponse {
  session_id: string;
  status: string;
  message: string;
}

export interface ChallengeItem {
  raised_by: string;
  target: string;
  reason: string;
  resolution: string | null;
}

export interface CompanyDossier {
  idea: string;
  problem_statement: string;
  target_audience: string;
  competitors: string[];
  unique_value_prop: string;
  mvp_scope: string[];
  tech_stack: string[];
  revenue_model: string;
  legal_structure: string;
  compliance_requirements: string[];
  marketing_strategy: string;
  target_channels: string[];
  challenges: ChallengeItem[];
  elevator_pitch: string;
}

export interface SessionResult {
  session_id: string;
  status: "running" | "completed" | "error";
  dossier: CompanyDossier | null;
  messages: AgentMessage[];
  created_at: string;
}
