"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "touch-manipulation mt-2 min-h-[48px] w-full rounded-xl border border-white/12 bg-slate-950/70 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-amber-400/45 focus:ring-2 focus:ring-amber-400/15 sm:min-h-0 sm:text-sm";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signErr) {
        setError(signErr.message);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="admin-email" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/75">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/75">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      {error ? (
        <p className="rounded-xl border border-rose-500/35 bg-rose-950/50 px-4 py-3 text-sm text-rose-100">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="touch-manipulation min-h-[48px] w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 py-3.5 text-base font-bold text-slate-950 shadow-[0_8px_32px_rgba(249,115,22,0.35)] ring-2 ring-white/15 transition enabled:hover:brightness-110 enabled:active:scale-[0.99] disabled:opacity-55 sm:text-sm"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
