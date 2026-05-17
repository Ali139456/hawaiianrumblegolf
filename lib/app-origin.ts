/**
 * Absolute origin for redirects and webhooks (no trailing slash).
 * Local dev uses port 3001 (see package.json `next dev -p 3001`).
 */
export function getAppOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3001";
}
