/** Shared arrival windows for tickets modal + capacity API. */

export type VisitTimeSlot = {
  value: string;
  label: string;
  /** After 10:00 PM — Fri & Sat only in copy */
  friSatOnly: boolean;
};

function formatTime12h(h24: number, minute: number) {
  const d = new Date();
  d.setHours(h24, minute, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function buildVisitTimeSlots(): VisitTimeSlot[] {
  const slots: VisitTimeSlot[] = [];
  for (let total = 9 * 60; total <= 23 * 60; total += 30) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const label = formatTime12h(h, m);
    const friSatOnly = total > 22 * 60;
    slots.push({
      value,
      label: friSatOnly ? `${label} (Fri & Sat)` : label,
      friSatOnly,
    });
  }
  return slots;
}

export const VISIT_TIME_SLOTS = buildVisitTimeSlots();

export function formatVisitTimeLabel(value: string) {
  const slot = VISIT_TIME_SLOTS.find((s) => s.value === value);
  return slot?.label ?? value;
}

/** 0 = Sun … 6 = Sat */
export function isFriSatVisitDate(isoDate: string) {
  const t = new Date(`${isoDate}T12:00:00`).getTime();
  if (Number.isNaN(t)) return false;
  const day = new Date(t).getDay();
  return day === 5 || day === 6;
}

export function slotAllowedOnDate(slot: VisitTimeSlot, isoDate: string) {
  if (!slot.friSatOnly) return true;
  return isFriSatVisitDate(isoDate);
}
