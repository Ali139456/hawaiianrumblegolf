export function ExperienceSection() {
  const cards = [
    {
      title: "Family outings",
      body: "Colorful holes, playful obstacles, and room to laugh together—perfect after the parks.",
    },
    {
      title: "Date night",
      body: "Lights, music, and a laid-back pace—mini golf that feels like a mini vacation.",
    },
    {
      title: "Youth groups",
      body: "Bring the crew—ask about group pricing for teams, schools, and celebrations.",
    },
  ];

  return (
    <section id="experience" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Turn up the fun
          </h2>
          <p className="mt-3 text-lg text-muted">
            Wheelchair accessible with two full 18-hole courses—music on, smiles up, putters ready.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="rounded-3xl border border-slate-200 bg-surface p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
