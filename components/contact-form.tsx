"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

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
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-800">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-brand/30 transition focus:bg-white focus:ring-2"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-slate-800">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-brand/30 transition focus:bg-white focus:ring-2"
          />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-slate-800">Phone (optional)</span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-brand/30 transition focus:bg-white focus:ring-2"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-slate-800">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-brand/30 transition focus:bg-white focus:ring-2"
          placeholder="Group outings, birthday parties, or general questions…"
        />
      </label>

      {status === "ok" ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Thanks—we received your message and will get back to you soon.
        </p>
      ) : null}
      {status === "err" && error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
