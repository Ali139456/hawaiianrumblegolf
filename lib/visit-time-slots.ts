/** Arrival windows for tickets modal + checkout validation. */

export type VisitTimeSlot = {
  value: string;
  label: string;
  friSatOnly: boolean;
};

const VISIT_TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

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
    const friSatOnly = total > 22 * 60;
    slots.push({
      value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      label: friSatOnly ? `${formatTime12h(h, m)} (Fri & Sat)` : formatTime12h(h, m),
      friSatOnly,
    });
  }
  return slots;
}

export const VISIT_TIME_SLOTS = buildVisitTimeSlots();

export function isValidVisitTime(value: string) {
  return VISIT_TIME_PATTERN.test(value);
}

export function formatVisitTimeLabel(value: string) {
  return VISIT_TIME_SLOTS.find((s) => s.value === value)?.label ?? value;
}

export function formatVisitTimeForStripe(value: string) {
  const [h, m] = value.split(":").map((x) => Number.parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

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
