import Image from "next/image";
import type { GoogleReviewCard } from "@/lib/google-reviews";

const AVATAR_GRADIENTS = [
  "from-sky-500 to-teal-600",
  "from-orange-400 to-rose-500",
  "from-emerald-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-indigo-600",
  "from-teal-500 to-emerald-700",
] as const;

function hashPick(str: string, mod: number) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h + str.charCodeAt(i) * (i + 1)) % 2147483647;
  return Math.abs(h) % mod;
}

function StarRow({ value, compact }: { value: number; compact?: boolean }) {
  const n = Math.round(Math.min(5, Math.max(0, value)));
  const size = compact ? "text-[11px]" : "text-[13px]";
  return (
    <div
      className={`flex gap-0.5 ${size} tracking-wide text-amber-400 drop-shadow-[0_1px_1px_rgba(251,191,36,0.35)]`}
      aria-label={`${n} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? "text-amber-400" : "text-slate-200"}>
          {i < n ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function InitialsAvatar({ name, compact }: { name: string; compact?: boolean }) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  const grad = AVATAR_GRADIENTS[hashPick(name, AVATAR_GRADIENTS.length)];
  const size = compact
    ? "h-10 w-10 text-[11px] ring-2 shadow-[0_3px_10px_rgba(15,118,110,0.3)]"
    : "h-12 w-12 text-[13px] ring-[3px] shadow-[0_4px_14px_rgba(15,118,110,0.35)]";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${grad} font-bold text-white ${size} ring-white`}
      aria-hidden
    >
      {(a + b).toUpperCase()}
    </div>
  );
}

function ReviewAvatar({ review, compact }: { review: GoogleReviewCard; compact?: boolean }) {
  const dim = compact ? 40 : 48;
  const ring = compact ? "ring-2 ring-offset-1" : "ring-[3px] ring-offset-2";

  if (review.profilePhotoUrl) {
    return (
      <Image
        src={review.profilePhotoUrl}
        alt=""
        width={dim}
        height={dim}
        className={`${compact ? "h-10 w-10" : "h-12 w-12"} shrink-0 rounded-full object-cover shadow-[0_4px_14px_rgba(15,23,42,0.15)] ${ring} ring-white ring-offset-emerald-50/80`}
      />
    );
  }
  return <InitialsAvatar name={review.authorName} compact={compact} />;
}

type TestimonialReviewCardProps = {
  review: GoogleReviewCard;
  useGoogle: boolean;
  /** Tighter layout for the mobile carousel */
  compact?: boolean;
};

export function TestimonialReviewCard({ review, useGoogle, compact }: TestimonialReviewCardProps) {
  const outerR = compact ? "rounded-[1.05rem]" : "rounded-[1.35rem]";
  const innerR = compact ? "rounded-[1rem]" : "rounded-[1.3rem]";
  const pad = compact ? "px-4 pb-4 pt-5" : "px-6 pb-6 pt-7 sm:px-7";
  const quoteSize = compact ? "text-[2.75rem] top-2 -left-0.5" : "text-[4.5rem] top-3 -left-1";

  return (
    <article className="group relative flex h-full flex-col">
      <div
        className={`${outerR} bg-gradient-to-br from-amber-200/35 via-white/80 to-teal-200/35 p-[1px] shadow-[0_12px_40px_-14px_rgba(13,148,136,0.22)] transition-all duration-300 md:group-hover:-translate-y-1 md:group-hover:shadow-[0_20px_50px_-16px_rgba(13,148,136,0.28)]`}
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden ${innerR} border border-white/90 bg-gradient-to-b from-white/98 via-white/95 to-emerald-50/25 ${pad} backdrop-blur-sm`}
        >
          <span
            className={`pointer-events-none absolute font-serif leading-none text-emerald-600/[0.07] ${quoteSize}`}
            aria-hidden
          >
            &ldquo;
          </span>
          <div className={`relative flex items-start ${compact ? "gap-2.5" : "gap-3.5"}`}>
            {useGoogle ? <ReviewAvatar review={review} compact={compact} /> : <InitialsAvatar name={review.authorName} compact={compact} />}
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={`font-semibold tracking-tight text-slate-900${compact ? " text-[15px]" : ""}`}>{review.authorName}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2 sm:gap-x-2.5 sm:gap-y-1.5">
                <StarRow value={review.rating} compact={compact} />
                {review.relativeTime ? (
                  <span className="text-[10px] font-medium text-slate-500 sm:text-[11px]">{review.relativeTime}</span>
                ) : !useGoogle ? (
                  <span className="rounded-full bg-gradient-to-r from-amber-100/90 to-orange-100/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-950 ring-1 ring-amber-400/25 sm:px-2 sm:py-0.5 sm:text-[10px]">
                    Guest favorite
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <blockquote
            className={`relative flex-1 border-t border-emerald-900/[0.06] font-medium text-slate-700 ${
              compact ? "mt-3 pt-3 text-[13px] leading-relaxed" : "mt-5 pt-5 text-[15px] leading-relaxed"
            }`}
          >
            <span className={compact ? "line-clamp-5" : "line-clamp-7"}>{review.text}</span>
          </blockquote>
        </div>
      </div>
    </article>
  );
}
