import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }> | { error?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (user?.email && adminEmail && user.email.toLowerCase() === adminEmail) {
    redirect("/admin/dashboard");
  }

  const sp =
    searchParams != null && typeof (searchParams as Promise<unknown>).then === "function"
      ? await (searchParams as Promise<{ error?: string }>)
      : (searchParams as { error?: string } | undefined);
  const authError = sp?.error === "auth";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(45,212,191,0.2),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_50%,rgba(251,191,36,0.1),transparent_50%)]"
        aria-hidden
      />
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-px rounded-[1.65rem] bg-gradient-to-br from-amber-400/25 via-white/10 to-teal-500/20 blur-sm" aria-hidden />
        <div className="relative rounded-3xl border border-white/15 bg-slate-900/85 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-10">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.38em] text-amber-300/95">Staff only</p>
          <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-white sm:text-[1.75rem]">Admin sign in</h1>
          <p className="mt-3 text-center text-sm leading-relaxed text-slate-400">
            Use the email and password from{" "}
            <span className="text-slate-200">Supabase → Authentication → Users</span>.
          </p>
          {authError ? (
            <p className="mt-5 rounded-xl border border-amber-500/35 bg-amber-950/50 px-4 py-3 text-center text-sm text-amber-100">
              Sign-in link failed. Use email and password below, or try again.
            </p>
          ) : null}
          <AdminLoginForm />
          <p className="mt-8 text-center text-xs text-slate-500">
            <Link href="/" className="font-medium text-teal-400/95 underline-offset-4 transition hover:text-teal-300 hover:underline">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
