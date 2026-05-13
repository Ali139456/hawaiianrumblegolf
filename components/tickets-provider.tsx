"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { TicketsModalPanel } from "@/components/tickets-modal-panel";

type TicketsContextValue = {
  openTickets: () => void;
  closeTickets: () => void;
  isOpen: boolean;
};

const TicketsContext = createContext<TicketsContextValue | null>(null);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const openTickets = useCallback(() => setOpen(true), []);
  const closeTickets = useCallback(() => setOpen(false), []);
  const value = useMemo(
    () => ({ openTickets, closeTickets, isOpen }),
    [isOpen, openTickets, closeTickets],
  );

  return (
    <TicketsContext.Provider value={value}>
      {children}
      <TicketsModalPanel open={isOpen} onClose={closeTickets} />
    </TicketsContext.Provider>
  );
}

export function useTickets(): TicketsContextValue {
  const ctx = useContext(TicketsContext);
  if (!ctx) {
    throw new Error("useTickets must be used within TicketsProvider");
  }
  return ctx;
}

/** Safe on routes that omit `TicketsProvider` (should not happen on the public site). */
export function useTicketsOptional(): TicketsContextValue | null {
  return useContext(TicketsContext);
}
