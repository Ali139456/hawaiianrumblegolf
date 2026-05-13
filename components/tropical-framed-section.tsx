import type { ReactNode } from "react";

type Props = {
  id?: string;
  children: ReactNode;
  /** Extra classes on the outer `<section>` (e.g. borders). */
  className?: string;
  /** Override inner wrapper (default: `mx-auto max-w-6xl`). */
  innerClassName?: string;
};

/**
 * Light “luau invite” frame: tropical motifs cluster at the edges; center stays bright for copy.
 */
export function TropicalFramedSection({ id, children, className = "", innerClassName }: Props) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 relative isolate overflow-hidden px-4 py-20 sm:px-6 ${className}`}
    >
      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(168deg,#f3fbf7_0%,#e9f7f1_38%,#eef9f4_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_72%_58%_at_50%_48%,rgba(255,253,250,0.94)_0%,transparent_70%)]"
        aria-hidden
      />
      <TropicalFrameCorners />
      <div className={`relative z-10 mx-auto max-w-6xl ${innerClassName ?? ""}`}>{children}</div>
    </section>
  );
}

function TropicalFrameCorners() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Top-left: split leaf / monstera feel */}
      <svg
        className="absolute -left-[8%] -top-[12%] w-[min(58vw,22rem)] text-emerald-700/25 sm:w-[26rem]"
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M40 260c-30-80 10-180 90-220 50-24 110-18 150 20 28 26 38 70 20 110-18 42-62 68-110 72-48 4-120-8-150 18Z"
        />
        <path
          fill="currentColor"
          fillOpacity={0.55}
          d="M20 120c28-72 98-118 175-95 32 10 55 38 62 72 4 20-2 42-14 58-40 52-120 48-180 18-18-9-35-28-43-53Z"
        />
        <path
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={3}
          strokeLinecap="round"
          d="M88 64c12 24 8 52-8 72M132 52c4 28-6 54-24 70M168 88c-18 22-22 48-12 72"
        />
      </svg>

      {/* Top-right: hibiscus-style bloom */}
      <svg
        className="absolute -right-[6%] -top-[10%] w-[min(52vw,20rem)] text-pink-500/20 sm:w-[24rem]"
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="132" cy="128" r="28" fill="currentColor" className="text-amber-300/50" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="132"
            cy="128"
            rx="52"
            ry="24"
            fill="currentColor"
            transform={`rotate(${deg} 132 128)`}
          />
        ))}
        <circle cx="132" cy="128" r="14" fill="currentColor" className="text-orange-400/35" />
      </svg>

      {/* Bottom-left: palm arc */}
      <svg
        className="absolute -bottom-[8%] -left-[14%] w-[min(65vw,24rem)] text-teal-700/20 sm:w-[28rem]"
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M-20 220c40-120 140-200 280-200 20 0 40 4 60 12-100 20-190 90-230 200-36 96-40 120-110 88Z"
        />
        <path
          fill="currentColor"
          fillOpacity={0.5}
          d="M60 200c50-70 130-110 220-100-60 30-110 80-140 150-16 38-48 52-80 30Z"
        />
      </svg>

      {/* Bottom-right: plumeria-style trio + warm dots */}
      <svg
        className="absolute -bottom-[6%] -right-[4%] w-[min(48vw,18rem)] text-orange-400/22 sm:w-[22rem]"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[0, 120, 240].map((deg) => (
          <ellipse
            key={deg}
            cx="120"
            cy="118"
            rx="40"
            ry="18"
            fill="rgba(251, 146, 60, 0.2)"
            transform={`rotate(${deg} 120 118)`}
          />
        ))}
        <circle cx="120" cy="118" r="16" fill="currentColor" className="text-amber-200/45" />
        <circle cx="200" cy="40" r="6" fill="currentColor" className="text-pink-400/30" />
        <circle cx="210" cy="64" r="4" fill="currentColor" className="text-orange-400/35" />
      </svg>

      {/* Soft bamboo / tiki horizontal accent */}
      <div
        className="absolute bottom-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-emerald-800/15 to-transparent"
        aria-hidden
      />
    </div>
  );
}
