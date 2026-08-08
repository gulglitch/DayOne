const NODES = [
  { n: "01", label: "Research", top: "5%" },
  { n: "02", label: "Product", top: "21%" },
  { n: "03", label: "Finance", top: "37%" },
  { n: "04", label: "Legal", top: "53%" },
  { n: "05", label: "Marketing", top: "69%" },
  { n: "06", label: "CEO", top: "85%" },
];

export default function PipelineBlueprint() {
  return (
    <div
      className="blueprint-bg absolute inset-0 pointer-events-none"
      style={{ opacity: 0.45 }}
      aria-hidden
    >
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: 38,
          width: 1,
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--color-blueprint) 0 6px, transparent 6px 14px)",
        }}
      />

      {NODES.map((node) => (
        <div key={node.label} className="absolute left-0 right-0" style={{ top: node.top }}>
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              left: 16,
              width: 44,
              height: 44,
              border: "2px solid var(--color-blueprint)",
            }}
          >
            <div className="absolute h-px w-5" style={{ background: "var(--color-blueprint)" }} />
            <div className="absolute w-px h-5" style={{ background: "var(--color-blueprint)" }} />
          </div>
          <div
            className="mono-label absolute whitespace-nowrap"
            style={{
              left: 76,
              top: 14,
              color: "var(--color-blueprint)",
              letterSpacing: "0.14em",
            }}
          >
            <span style={{ opacity: 0.65, marginRight: 8 }}>{node.n}</span>
            {node.label.toUpperCase()}
          </div>
        </div>
      ))}

      <div
        className="mono-label absolute top-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          right: 28,
          color: "var(--color-blueprint)",
          writingMode: "vertical-rl",
          letterSpacing: "0.3em",
        }}
      >
        SIX AGENTS · ONE ARGUMENT
      </div>
    </div>
  );
}