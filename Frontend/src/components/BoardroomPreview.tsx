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
            <div className="rounded-2xl bg-paper-deep/40 p-6 sm:p-10 space-y-8">
              {boardroomTranscript.map((msg, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                  <span className="mono-label text-ink-faint shrink-0 sm:w-44 pt-1">
                    {msg.agent}
                  </span>

                  {msg.kind === "resolution" ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <Stamp label="Ruling" color="var(--color-stamp-green)" />
                      <p className="font-display text-lg sm:text-xl text-ink italic">
                        {msg.text}
                      </p>
                    </div>
                  ) : msg.kind === "challenge" ? (
                    <p className="text-ink-soft flex-1">
                      <span
                        className="mono-label mr-2 inline-block -rotate-2 px-1.5 py-0.5 rounded"
                        style={{
                          color: "var(--color-stamp-red)",
                          border: "1.5px solid var(--color-stamp-red)",
                        }}
                      >
                        Objection
                      </span>
                      {msg.text}
                    </p>
                  ) : (
                    <p className="text-ink-soft flex-1">{msg.text}</p>
                  )}
                </div>
              ))}
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
