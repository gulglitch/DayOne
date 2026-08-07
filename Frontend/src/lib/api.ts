import type { AnalyzeResponse, SessionResult } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export function wsUrl(sessionId: string): string {
  const base = API_URL.replace(/^http/, "ws");
  return `${base}/ws/${sessionId}`;
}

export async function startAnalysis(
  idea: string,
  targetMarket?: string
): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idea,
      target_market: targetMarket ? targetMarket : undefined,
    }),
  });
  if (!res.ok) {
    throw new Error(`Couldn't start the analysis (HTTP ${res.status}).`);
  }
  return res.json();
}

export async function getResult(sessionId: string): Promise<SessionResult> {
  const res = await fetch(`${API_URL}/api/result/${sessionId}`);
  if (!res.ok) {
    throw new Error(`Couldn't fetch the result (HTTP ${res.status}).`);
  }
  return res.json();
}
