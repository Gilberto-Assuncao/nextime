import { Badge, EmptyState } from "@/src/components/data-display";
import type { SiteWeather } from "@/src/features/weather/data";

function formatDay(date: string): string {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${date}T00:00:00`));
}

const alertTone = { none: "neutral", watch: "warning", "delay-risk": "danger" } as const;
const alertLabel = { none: "Clear", watch: "Watch", "delay-risk": "Delay risk" } as const;

export default function SiteWeatherOverview({ sites }: { sites: SiteWeather[] }) {
  if (!sites.length) {
    return <EmptyState title="No sites yet" description="Sites with coordinates will show a 7-day forecast and delay risk here." />;
  }

  return <div className="grid gap-5">
    {sites.map((site) => <section key={site.id} aria-labelledby={`site-${site.id}-title`} className="rounded-2xl border border-white/10 bg-[#161A34] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`site-${site.id}-title`} className="text-lg font-semibold text-[#E5E7EB]">{site.name}</h2>
        {site.city ? <span className="text-sm text-[#9CA3AF]">{site.city}</span> : null}
      </div>

      {site.error ? <p className="mt-4 text-sm text-[#9CA3AF]">{site.error}</p> : null}

      {site.forecast ? <div className="mt-4 overflow-x-auto"><div className="flex min-w-max gap-3">
        {site.forecast.map((day) => <div key={day.date} className="flex w-32 flex-col gap-2 rounded-xl bg-white/5 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">{formatDay(day.date)}</span>
          <span className="text-lg font-bold text-[#E5E7EB]">{Math.round(day.temperatureMaxC)}° <span className="text-sm font-normal text-[#9CA3AF]">/ {Math.round(day.temperatureMinC)}°</span></span>
          <span className="text-xs text-[#9CA3AF]">Rain {Math.round(day.precipitationProbability)}% · Wind {Math.round(day.windSpeedMaxKmh)} km/h</span>
          <Badge tone={alertTone[day.alert.level]}>{alertLabel[day.alert.level]}</Badge>
          {day.alert.level !== "none" ? <span className="text-xs text-[#9CA3AF]">{day.alert.reason}</span> : null}
        </div>)}
      </div></div> : null}
    </section>)}
  </div>;
}
