import type { ReactNode } from "react";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

type Blob = {
  className: string;
  color: string;
};

/** Slight variation per section so motifs don’t repeat identically. */
function blobsForSection(id?: string): Blob[] {
  const key = id ?? "default";
  const n = key.length % 3;

  const sets: Blob[][] = [
    [
      { className: "left-[-18%] top-[8%] h-[min(72vw,26rem)] w-[min(72vw,26rem)]", color: "bg-emerald-500/14" },
      { className: "right-[-12%] top-[18%] h-[min(58vw,20rem)] w-[min(58vw,20rem)]", color: "bg-pink-500/10" },
      { className: "left-[22%] top-[42%] h-[min(48vw,16rem)] w-[min(48vw,16rem)]", color: "bg-teal-400/10" },
      { className: "right-[8%] bottom-[6%] h-[min(64vw,22rem)] w-[min(64vw,22rem)]", color: "bg-amber-500/10" },
    ],
    [
      { className: "right-[-20%] top-[4%] h-[min(70vw,24rem)] w-[min(70vw,24rem)]", color: "bg-sky-500/12" },
      { className: "left-[10%] top-[28%] h-[min(52vw,18rem)] w-[min(52vw,18rem)]", color: "bg-emerald-400/11" },
      { className: "right-[28%] bottom-[12%] h-[min(44vw,15rem)] w-[min(44vw,15rem)]", color: "bg-orange-500/9" },
      { className: "left-[-8%] bottom-[2%] h-[min(60vw,20rem)] w-[min(60vw,20rem)]", color: "bg-violet-500/10" },
    ],
    [
      { className: "left-[-14%] top-[14%] h-[min(66vw,23rem)] w-[min(66vw,23rem)]", color: "bg-teal-500/12" },
      { className: "right-[6%] top-[38%] h-[min(50vw,17rem)] w-[min(50vw,17rem)]", color: "bg-amber-400/10" },
      { className: "left-[38%] bottom-[8%] h-[min(56vw,19rem)] w-[min(56vw,19rem)]", color: "bg-emerald-500/9" },
      { className: "right-[-16%] bottom-[-4%] h-[min(68vw,24rem)] w-[min(68vw,24rem)]", color: "bg-rose-500/8" },
    ],
  ];

  return sets[n] ?? sets[0];
}

/**
 * Section backdrop: soft ambient color (no hard SVG clips). Motifs can sit in the
 * middle of the section and fade out at edges so nothing looks “cut off”.
 */
export function TropicalFramedSection({ id, children, className = "", innerClassName }: Props) {
  const blobs = blobsForSection(id);

  return (
    <section
      id={id}
      className={`scroll-mt-24 relative isolate px-4 py-20 sm:px-6 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(168deg,#0d1524_0%,#0b1220_42%,#0a101c_100%)]"
        aria-hidden
      />

      {/* Soft center lift — wide falloff, no visible ring */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_120%_90%_at_50%_42%,rgba(22,32,52,0.55)_0%,transparent_72%)]"
        aria-hidden
      />

      {/* Ambient blobs: blurred circles, edge-masked so they feather into adjacent sections */}
      <div
        className="section-ambient-mask pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        {blobs.map((blob, i) => (
          <div
            key={`${id ?? "s"}-blob-${i}`}
            className={`absolute rounded-full blur-[72px] sm:blur-[88px] ${blob.className} ${blob.color}`}
          />
        ))}
      </div>

      <div className={`relative z-10 mx-auto max-w-6xl ${innerClassName ?? ""}`}>{children}</div>
    </section>
  );
}
