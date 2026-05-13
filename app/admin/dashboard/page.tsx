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
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/90">
      <header className="border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-700/90">Admin</p>
            <h1 className="text-xl font-bold text-slate-900">Website settings</h1>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <AdminSettingsForm initialSite={initial} />
      </div>
    </div>
  );
}
