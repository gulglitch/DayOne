import Reveal from "./Reveal";
import Stamp from "./Stamp";
import { boardroomTranscript } from "@/lib/data";

export default function BoardroomPreview() {
  return (
    <section id="boardroom" className="py-28 sm:py-36">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <p className="mono-label text-seal mb-5">The Boardroom</p>
          <h2 className="font-display text-3xl sm:text-5xl leading-[1.1] max-w-2xl text-ink">
            Watch it happen, live.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 rounded-[1.4rem] border-2 border-ink bg-paper p-2 sm:p-3">
            <div className="rounded-2xl bg-paper-deep/40 p-6 sm:p-9">
              {boardroomTranscript.map((msg, i) => {
                const accent =
                  msg.kind === "challenge"
                    ? "var(--color-stamp-red)"
                    : msg.kind === "resolution"
                    ? "var(--color-stamp-green)"
                    : "var(--color-ink-faint)";
                return (
                  <div key={i} className="flex items-start gap-3 py-2.5">
                    <div
                      className="mono-label shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[0.58rem]"
                      style={{ background: "var(--color-paper)", color: accent, border: `1.5px solid ${accent}` }}
                      aria-hidden
                    >
                      {msg.agent.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="mono-label text-ink-faint text-[0.62rem]">{msg.agent}</span>
                        {msg.kind === "challenge" && (
                          <span
                            className="mono-label text-[0.56rem] px-1.5 py-0.5 rounded"
                            style={{ color: accent, border: `1px solid ${accent}` }}
                          >
                            Objection
                          </span>
                        )}
                        {msg.kind === "resolution" && (
                          <Stamp label="Ruling" color={accent} compact />
                        )}
                      </div>
                      <div
                        className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-[0.92rem] leading-relaxed text-ink-soft"
                        style={{
                          background: "var(--color-paper-deep)",
                          borderLeft: msg.kind !== "post" ? `3px solid ${accent}` : undefined,
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-center mono-label text-ink-faint">
            That&rsquo;s a sample run.{" "}
            <a href="#start" className="text-seal hover:underline">
              Submit your own idea above
            </a>{" "}
            to watch a real one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
