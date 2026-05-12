"use client";

import type { CSSProperties } from "react";
import { useInViewOnce } from "@/components/motion/use-in-view-once";

type StaggerRootProps = {
  children: React.ReactNode;
  className?: string;
};

export function StaggerRoot({ children, className }: StaggerRootProps) {
  const { ref, visible } = useInViewOnce();

  return (
    <div
      ref={ref}
      className={`stagger-group${visible ? " stagger-group-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}

type MotionItemProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger order inside parent `StaggerRoot` (0-based). */
  index?: number;
  /** Subtle lift on hover (CSS only). */
  lift?: boolean;
};

export function MotionItem({ children, className, index = 0, lift }: MotionItemProps) {
  const style = {
    "--stagger-delay": `${index * 70}ms`,
  } as CSSProperties;

  return (
    <div
      style={style}
      className={`stagger-item${lift ? " motion-lift" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
