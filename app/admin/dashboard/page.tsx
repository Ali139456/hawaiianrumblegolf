import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSettingsForm } from "@/components/admin-settings-form";
import { getLiveSite } from "@/lib/site-live";
import type { SiteConfig } from "@/lib/site";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!user?.email || !adminEmail || user.email.toLowerCase() !== adminEmail) {
    redirect("/admin/login");
  }

  const site = await getLiveSite();
  const initial = JSON.parse(JSON.stringify(site)) as SiteConfig;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(45,212,191,0.18),transparent_50%),radial-gradient(ellipse_80%_50%_at_100%_0%,rgba(251,191,36,0.12),transparent_45%),radial-gradient(ellipse_60%_40%_at_0%_100%,rgba(244,63,94,0.08),transparent_40%)]"
        aria-hidden
      />
      <div className="relative border-b border-white/10 bg-slate-950/80 px-4 py-6 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-300/90">Hawaiian Rumble</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Site settings</h1>
            <p className="mt-2 text-sm text-slate-400">
              Signed in as <span className="font-medium text-slate-200">{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 sm:py-10">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <AdminSettingsForm initialSite={initial} />
        </div>
      </div>
    </div>
  );
}
