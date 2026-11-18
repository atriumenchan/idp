import { SAMPLE_STORIES } from "@/lib/copy";

export function Testimonials() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Demonstration only</p>
        <h2 className="mt-2 max-w-2xl font-serif text-4xl leading-tight">Sample stories, not customer reviews</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">
          These three notes were written for this internal demonstration. They are not quotes from customers, and this site has no rating and no review count.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SAMPLE_STORIES.map((story) => (
            <figure key={story.name} className="rounded-3xl border border-line bg-card p-6">
              <span className="rounded-full bg-ivory px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sand">
                Sample
              </span>
              <blockquote className="mt-4 text-base leading-relaxed">“{story.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-mute">
                {story.name}
                <span className="block">{story.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
