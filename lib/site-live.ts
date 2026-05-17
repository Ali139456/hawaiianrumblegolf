import { unstable_cache } from "next/cache";
import { site as defaultSite, type SiteConfig } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const LIVE_SITE_TAG = "live-site";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function deepMerge(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, patchVal] of Object.entries(patch)) {
    if (patchVal === undefined) continue;
    if (Array.isArray(patchVal)) {
      out[key] = patchVal;
      continue;
    }
    if (isPlainObject(patchVal) && isPlainObject(out[key])) {
      out[key] = deepMerge(out[key] as Record<string, unknown>, patchVal);
      continue;
    }
    out[key] = patchVal;
  }
  return out;
}

function siteToWritable(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(defaultSite)) as Record<string, unknown>;
}

async function loadStoredOverrides(): Promise<Record<string, unknown>> {
  const admin = getSupabaseAdmin();
  if (!admin) return {};
  const { data, error } = await admin.from("site_settings").select("content").eq("id", 1).maybeSingle();
  if (error || data?.content == null) return {};
  if (typeof data.content !== "object" || Array.isArray(data.content)) return {};
  return data.content as Record<string, unknown>;
}

/** Admin/CMS copies may still say 10 AM — keep opening time in sync with `defaultSite`. */
function patchLegacyOpeningTime(text: string): string {
  return text
    .replace(/Sunday – Thursday \| 10:00 AM/g, "Sunday – Thursday | 9:00 AM")
    .replace(/Friday & Saturday \| 10:00 AM/g, "Friday & Saturday | 9:00 AM")
    .replace(/Sun–Thu 10AM/g, "Sun–Thu 9AM")
    .replace(/Fri–Sat 10AM/g, "Fri–Sat 9AM");
}

function normalizeSiteConfig(merged: SiteConfig): SiteConfig {
  const hours = {
    week: patchLegacyOpeningTime(merged.hours.week),
    weekend: patchLegacyOpeningTime(merged.hours.weekend),
  } as SiteConfig["hours"];
  const tickerLines = merged.tickerLines.map((line) =>
    patchLegacyOpeningTime(line),
  );
  return { ...merged, hours, tickerLines } as unknown as SiteConfig;
}

async function computeMergedSite(): Promise<SiteConfig> {
  const base = siteToWritable();
  const overrides = await loadStoredOverrides();
  const merged = deepMerge(base, overrides);
  return normalizeSiteConfig(merged as SiteConfig);
}

export const getLiveSite = unstable_cache(computeMergedSite, ["merged-site"], {
  revalidate: 60,
  tags: [LIVE_SITE_TAG],
});
