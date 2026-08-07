export default function BouncingDots({
  color = "var(--color-ink-faint)",
  size = 6,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bounce-dot rounded-full inline-block"
          style={{
            width: size,
            height: size,
            background: color,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}
