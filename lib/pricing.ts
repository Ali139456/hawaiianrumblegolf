export function parseUsd(value: string) {
  const n = Number.parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

export function usdToCents(usd: number) {
  return Math.max(0, Math.round(usd * 100));
}
