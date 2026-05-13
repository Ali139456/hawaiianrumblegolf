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

  const sp = searchParams != null && typeof (searchParams as Promise<unknown>).then === "function"
    ? await (searchParams as Promise<{ error?: string }>)
    : (searchParams as { error?: string } | undefined);
  const authError = sp?.error === "auth";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-16 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-amber-300/90">Staff</p>
        <h1 className="mt-2 text-center text-2xl font-bold text-white">Site admin</h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sign in with the account created in{" "}
          <span className="text-slate-200">Supabase → Authentication → Users</span>.
        </p>
        {authError ? (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/40 px-3 py-2 text-center text-sm text-amber-100">
            Sign-in link failed. Use email and password below, or try again.
          </p>
        ) : null}
        <AdminLoginForm />
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="text-teal-400 underline-offset-2 hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
