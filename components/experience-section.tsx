import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { TropicalFramedSection } from "@/components/tropical-framed-section";

function IconFamily({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function IconSparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function IconFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
      />
    </svg>
  );
}

const cardStyles = [
  {
    icon: IconFamily,
    chip: "After the parks",
    iconWrap: "from-amber-400 to-orange-500 shadow-amber-500/25",
    frame: "from-amber-200/45 via-white/70 to-orange-100/35",
  },
  {
    icon: IconSparkle,
    chip: "Lights & music",
    iconWrap: "from-fuchsia-500 to-rose-500 shadow-rose-500/25",
    frame: "from-pink-200/40 via-white/70 to-rose-100/35",
  },
  {
    icon: IconFlag,
    chip: "Teams & parties",
    iconWrap: "from-sky-500 to-teal-600 shadow-teal-500/25",
    frame: "from-sky-200/45 via-white/70 to-teal-100/35",
  },
] as const;

export function ExperienceSection() {
  const cards = [
    {
      title: "Family outings",
      body: "Colorful holes, playful obstacles, and room to laugh together. Perfect after the parks. Play twice the same day and save on round two.",
    },
    {
      title: "Date night",
      body: "Lights, music, and a laid-back pace. Mini golf that feels like a mini vacation.",
    },
    {
      title: "Youth groups",
      body: "Bring the crew. Ask about group pricing for teams, schools, and celebrations.",
    },
  ];

  return (
    <TropicalFramedSection id="experience">
      <>
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal-800/75 sm:text-xs">
            Plan your visit
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.15rem] sm:leading-tight">
            Turn up the fun
          </h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-teal-500 shadow-sm" />
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Wheelchair accessible with two full 18-hole courses. Music on, smiles up, putters ready.
          </p>
        </Reveal>

        <StaggerRoot className="mt-14 grid gap-7 md:grid-cols-3 md:gap-6 lg:gap-8">
          {cards.map((c, i) => {
            const style = cardStyles[i];
            const Icon = style.icon;
            return (
              <MotionItem key={c.title} lift index={i}>
                <article className="group relative flex h-full flex-col">
                  <div
                    className={`rounded-[1.35rem] bg-gradient-to-br ${style.frame} p-[1px] shadow-[0_14px_44px_-18px_rgba(13,148,136,0.2)] transition-shadow duration-300 group-hover:shadow-[0_22px_56px_-20px_rgba(13,148,136,0.28)]`}
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-white/90 bg-gradient-to-b from-white/98 via-white/95 to-emerald-50/20 px-7 pb-7 pt-8 backdrop-blur-sm">
                      <div
                        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-amber-200/25 to-transparent blur-2xl"
                        aria-hidden
                      />
                      <div className="relative flex items-start justify-between gap-3">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.iconWrap} text-white shadow-lg ring-2 ring-white/90`}
                        >
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className="rounded-full bg-slate-900/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 ring-1 ring-slate-900/[0.06]">
                          {style.chip}
                        </span>
                      </div>
                      <h3 className="relative mt-6 text-xl font-bold tracking-tight text-slate-900">{c.title}</h3>
                      <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-muted">{c.body}</p>
                      <div
                        className="relative mt-6 h-px w-full bg-gradient-to-r from-transparent via-emerald-800/10 to-transparent"
                        aria-hidden
                      />
                      <p className="relative mt-4 text-xs font-semibold text-teal-800/80">
                        Two 18s · tropical theming · walk-ins welcome
                      </p>
                    </div>
                  </div>
                </article>
              </MotionItem>
            );
          })}
        </StaggerRoot>
      </>
    </TropicalFramedSection>
  );
}
