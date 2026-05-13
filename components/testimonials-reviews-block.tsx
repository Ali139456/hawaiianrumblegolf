"use client";

import { useCallback, useState } from "react";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { TestimonialReviewCard } from "@/components/testimonials-review-card";
import type { GoogleReviewCard } from "@/lib/google-reviews";

type Props = { cards: GoogleReviewCard[]; useGoogle: boolean };

function CarouselArrow({
  direction,
  label,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-controls="testimonials-carousel-panel"
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-900/12 bg-white text-emerald-900 shadow-md ring-1 ring-white/80 transition enabled:hover:border-amber-400/45 enabled:hover:shadow-lg enabled:active:scale-95 disabled:pointer-events-none disabled:opacity-40"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        {direction === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export function TestimonialsReviewsBlock({ cards, useGoogle }: Props) {
  const n = cards.length;
  const [index, setIndex] = useState(0);

  const goPrev = useCallback(() => {
    setIndex((i) => {
      if (n <= 0) return i;
      const cur = Math.min(i, n - 1);
      return n <= 1 ? 0 : (cur - 1 + n) % n;
    });
  }, [n]);

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (n <= 0) return i;
      const cur = Math.min(i, n - 1);
      return n <= 1 ? 0 : (cur + 1) % n;
    });
  }, [n]);

  if (n === 0) return null;

  const safeIndex = Math.min(index, n - 1);
  const current = cards[safeIndex];

  return (
    <>
      <section
        className="mt-10 md:mt-14 md:hidden"
        aria-roledescription="carousel"
        aria-label="Guest reviews"
      >
        <div className="relative px-0.5">
          <div id="testimonials-carousel-panel" aria-live="polite" aria-atomic="true">
            <TestimonialReviewCard key={current.id} review={current} useGoogle={useGoogle} compact />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 px-1">
          <CarouselArrow direction="prev" label="Previous review" onClick={goPrev} disabled={n <= 1} />
          <p className="min-w-0 flex-1 text-center text-xs font-semibold tabular-nums text-slate-600">
            {safeIndex + 1} <span className="font-normal text-slate-400">/</span> {n}
          </p>
          <CarouselArrow direction="next" label="Next review" onClick={goNext} disabled={n <= 1} />
        </div>
      </section>

      <StaggerRoot className="mt-10 hidden gap-7 md:mt-14 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {cards.map((r, i) => (
          <MotionItem key={r.id} lift index={i}>
            <TestimonialReviewCard review={r} useGoogle={useGoogle} />
          </MotionItem>
        ))}
      </StaggerRoot>
    </>
  );
}
