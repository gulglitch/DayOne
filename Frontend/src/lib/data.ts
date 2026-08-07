export const sampleIdeas: string[] = [
  "a platform that helps university students find internships",
  "a marketplace for verified secondhand sneakers",
  "an app that splits rent fairly by room size and light",
  "a scheduling tool for freelance tutors and parents",
  "a subscription box for indie board games",
];

// Real pipeline order, as executed in backend/app/pipeline.py:
// research -> product -> finance (challenge) -> legal (challenge) -> marketing -> ceo (resolution)
export const pipelineAgents: { id: string; label: string }[] = [
  { id: "research", label: "Research" },
  { id: "product", label: "Product" },
  { id: "finance", label: "Finance" },
  { id: "legal", label: "Legal" },
  { id: "marketing", label: "Marketing" },
  { id: "ceo", label: "CEO" },
];

export function agentLabel(id: string): string {
  const found = pipelineAgents.find((a) => a.id === id);
  return found ? found.label : id === "system" ? "System" : id;
}

// Backend messages carry an emoji + label prefix baked into the string
// (e.g. "⚠️ CHALLENGE: ..."). We render our own badge/stamp for type, so
// strip both the emoji and any redundant label text.
export function cleanMessage(text: string, type?: string): string {
  let cleaned = text.replace(
    /^[\u2600-\u27BF\u{1F300}-\u{1FAFF}\uFE0F\u200D]+\s*/u,
    ""
  );
  if (type === "challenge") {
    cleaned = cleaned.replace(/^(CHALLENGE|LEGAL RISK):\s*/i, "");
  }
  if (type === "resolution") {
    cleaned = cleaned.replace(/^DECISIONS MADE:\s*/i, "");
  }
  return cleaned.trim();
}

// Marquee credit line — order here is just for display rhythm, not sequence.
export const agentRoles: { name: string; tag: string }[] = [
  { name: "CEO", tag: "Resolves the room" },
  { name: "Research", tag: "Market & competitors" },
  { name: "Product", tag: "MVP & stack" },
  { name: "Finance", tag: "Financial reality" },
  { name: "Legal", tag: "Compliance risk" },
  { name: "Marketing", tag: "Go-to-market" },
];

export const howItWorksSteps: { title: string; description: string }[] = [
  {
    title: "Research analyzes the market",
    description:
      "Competitors, market size, and the whitespace your idea might actually own.",
  },
  {
    title: "Product designs the MVP",
    description:
      "Scope, features, and a tech stack sized to what's actually buildable.",
  },
  {
    title: "Finance is sent in to challenge it",
    description:
      "Revenue model and unit economics get checked before you believe them.",
  },
  {
    title: "Legal is sent in too",
    description:
      "Compliance and structure flags raised before they become a real problem.",
  },
  {
    title: "Marketing builds the go-to-market",
    description:
      "Channels and strategy, built on whatever survived the last two steps.",
  },
  {
    title: "The CEO rules and closes the round",
    description:
      "Resolves both challenges, then writes the pitch you'll actually use.",
  },
];

export type BoardroomMessage = {
  agent: string;
  text: string;
  kind: "post" | "challenge" | "resolution";
};

// Static teaser for the landing page only — mirrors the real message shape
// and the real two-challenger pipeline (Finance, then Legal).
export const boardroomTranscript: BoardroomMessage[] = [
  {
    agent: "Research",
    text: "The internship space is crowded — Handshake and LinkedIn own it. Whitespace exists in verified, university-only matching.",
    kind: "post",
  },
  {
    agent: "Product",
    text: "A full recommendation engine plus a verification flow adds three weeks minimum before launch.",
    kind: "post",
  },
  {
    agent: "Finance",
    text: "Freemium at $15/mo won't clear CAC for a student audience. Recommend university licensing instead.",
    kind: "challenge",
  },
  {
    agent: "Legal",
    text: "Verifying student status at scale touches education-record handling — flag for review before launch.",
    kind: "challenge",
  },
  {
    agent: "CEO",
    text: "Cut the matching engine for MVP. Ship curated listings and verification only. University licensing approved; compliance review scheduled before launch.",
    kind: "resolution",
  },
];

export const dossierSections: { title: string; description: string }[] = [
  {
    title: "Problem & Audience",
    description: "What's broken, and exactly who feels it.",
  },
  {
    title: "Competitors & the Edge",
    description: "Who you're up against, and your one real advantage.",
  },
  {
    title: "MVP & Tech Stack",
    description: "What ships first, and what it's actually built on.",
  },
  {
    title: "Finance & Legal",
    description:
      "Revenue model, structure, and compliance flags — checked, not assumed.",
  },
  {
    title: "Go-to-Market",
    description: "Channels and strategy, sized to your budget.",
  },
  {
    title: "The Elevator Pitch",
    description: "A line you could read out loud tomorrow.",
  },
];
