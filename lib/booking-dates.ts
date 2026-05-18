/** Visit date helpers shared by checkout API and client forms. */

/** Match browser `<input type="date" min>` (local calendar day). */
export function todayIsoLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isValidVisitDate(iso: string, minIso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const t = new Date(`${iso}T12:00:00`).getTime();
  if (Number.isNaN(t)) return false;
  return t >= new Date(`${minIso}T12:00:00`).getTime();
}
