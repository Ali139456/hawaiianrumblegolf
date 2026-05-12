"use client";

import type { CSSProperties } from "react";
import { useInViewOnce } from "@/components/motion/use-in-view-once";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Extra delay after reveal starts (seconds). */
  delay?: number;
  /** Vertical offset in pixels before reveal. */
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const { ref, visible } = useInViewOnce();

  const style = {
    "--reveal-y": `${y}px`,
    "--reveal-delay": `${Math.round(delay * 1000)}ms`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal-on-scroll ${visible ? "reveal-on-scroll-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
