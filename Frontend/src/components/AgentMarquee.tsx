import { agentRoles } from "@/lib/data";

export default function AgentMarquee() {
  const items = [...agentRoles, ...agentRoles];
  return (
    <div className="relative border-y border-ink-faint/20 py-4 overflow-hidden bg-paper-deep/40">
      <div className="marquee-track">
        {items.map((role, i) => (
          <div key={i} className="flex items-center shrink-0 px-8">
            <span className="mono-label text-ink-soft">{role.name}</span>
            <span className="mx-8 text-seal">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
