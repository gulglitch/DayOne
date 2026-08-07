import Reveal from "./Reveal";

export default function ProblemSection() {
  return (
    <section className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <p className="mono-label text-seal mb-5">The Problem</p>
          <h2 className="font-display text-3xl sm:text-5xl leading-[1.1] max-w-3xl text-ink">
            Ask most AI tools to validate your idea, and they will
            enthusiastically help you build a bad one.
          </h2>
          <p className="mt-6 max-w-2xl text-ink-soft text-lg">
            A single model has no incentive to disagree with itself. Real
            founding teams work because someone has something to lose — a
            Finance person kills a feature Engineering wants, and a CEO
            breaks the tie.
          </p>
        </Reveal>

        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-ink-faint/25 bg-paper-deep/50 p-8">
              <p className="mono-label text-ink-faint mb-4">Generic AI tools</p>
              <p className="font-display italic text-2xl text-ink-faint">
                &ldquo;Yes, and here&rsquo;s how to make it even bigger.&rdquo;
              </p>
              <p className="mt-5 text-ink-soft">
                One voice, one incentive: keep you typing. No one in the room
                to say the pricing won&rsquo;t work.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="h-full rounded-2xl border-2 border-ink bg-paper p-8 relative overflow-hidden">
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10"
                style={{ background: "var(--color-seal)" }}
                aria-hidden
              />
              <p className="mono-label text-seal mb-4">Day One</p>
              <p className="font-display italic text-2xl text-ink">
                &ldquo;Wait — Finance says this doesn&rsquo;t clear CAC.&rdquo;
              </p>
              <p className="mt-5 text-ink-soft">
                Six agents, six incentives. A founding team that pushes back,
                in view, before you&rsquo;ve spent six months on it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
