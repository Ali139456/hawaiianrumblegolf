import { site } from "@/lib/site";

export function InfoStrip() {
  return (
    <section className="border-y border-amber-400/25 bg-gradient-to-r from-amber-400/15 via-orange-500/10 to-sky-400/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <p className="text-center text-sm font-semibold text-slate-900 sm:text-left">
          Open 7 days a week · {site.phone}
        </p>
        <ul className="flex flex-col gap-2 text-sm text-slate-800 sm:flex-row sm:gap-8">
          <li className="text-center sm:text-left">{site.hours.week}</li>
          <li className="text-center sm:text-left">{site.hours.weekend}</li>
        </ul>
      </div>
    </section>
  );
}
