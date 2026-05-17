"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-surface-muted px-3.5 py-2.5 text-ink outline-none transition placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-400/20";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("err");
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setError("Network error. Please try again.");
      setStatus("err");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex h-full min-h-[420px] flex-col rounded-2xl border border-white/10 bg-surface-elevated shadow-[0_12px_48px_rgba(0,0,0,0.35)] ring-1 ring-white/5 lg:min-h-[520px]"
    >
      <div className="border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Message us</p>
        <p className="mt-1 text-lg font-semibold text-ink">Send a note</p>
        <p className="mt-1 text-sm text-muted">
          Groups, birthdays, or general questions — we&apos;ll reply as soon as we can.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-slate-300">Name</span>
            <input name="name" required autoComplete="name" className={fieldClass} />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-slate-300">Email</span>
            <input name="email" type="email" required autoComplete="email" className={fieldClass} />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-300">Phone (optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </label>
        <label className="grid flex-1 grid gap-1.5 text-sm">
          <span className="font-medium text-slate-300">Message</span>
          <textarea
            name="message"
            required
            rows={5}
            className={`min-h-[120px] flex-1 resize-y ${fieldClass}`}
            placeholder="Tell us your date, group size, or question…"
          />
        </label>

        {status === "ok" ? (
          <p className="rounded-xl bg-emerald-950/50 px-3 py-2.5 text-sm text-emerald-200 ring-1 ring-emerald-500/30">
            Thanks — we received your message and will get back to you soon.
          </p>
        ) : null}
        {status === "err" && error ? (
          <p className="rounded-xl bg-red-950/50 px-3 py-2.5 text-sm text-red-200 ring-1 ring-red-500/30">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-auto inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_6px_24px_rgba(249,115,22,0.35)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
