"use client";

import { startTransition, useLayoutEffect, useRef, useState } from "react";

const observerOptions: IntersectionObserverInit = {
  threshold: 0.08,
  rootMargin: "0px 0px -10% 0px",
};

function elementIsInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  return rect.top < vh && rect.bottom > 0;
}

export function useInViewOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (elementIsInViewport(el)) {
      startTransition(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        startTransition(() => setVisible(true));
        observer.disconnect();
      }
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
