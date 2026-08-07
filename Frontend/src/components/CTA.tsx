import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="py-28 sm:py-40">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl leading-[1.15] text-ink">
            Every company starts with an idea.
            <br />
            <span className="italic text-seal">
              The best ones survive an argument first.
            </span>
          </h2>
          <a
            href="#start"
            className="mono-label inline-block mt-10 bg-ink text-paper px-8 py-4 rounded-full hover:bg-seal transition-colors"
          >
            Start the meeting →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
