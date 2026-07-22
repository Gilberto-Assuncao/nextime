import { MapContainer, SiteMarker, GpsBadge } from "@/src/components/maps";
import { EmptyState } from "@/src/components/data-display";
import type { LiveOperationsPoint } from "@/src/features/operations/data";

function minutesAgo(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)}h ago`;
}

// No mapping library is wired up yet (a real basemap is a separate provider
// decision, like the weather/i18n ones). This places each point inside the
// placeholder grid proportionally to the others' lat/lon spread — a rough
// relative layout, not a geographically accurate projection.
function layout(points: LiveOperationsPoint[]) {
  if (points.length <= 1) return points.map((point) => ({ point, left: 50, top: 50 }));
  const lats = points.map((p) => p.latitude);
  const lons = points.map((p) => p.longitude);
  const latSpan = Math.max(Math.max(...lats) - Math.min(...lats), 0.001);
  const lonSpan = Math.max(Math.max(...lons) - Math.min(...lons), 0.001);
  return points.map((point) => ({
    point,
    left: 10 + ((point.longitude - Math.min(...lons)) / lonSpan) * 80,
    top: 10 + (1 - (point.latitude - Math.min(...lats)) / latSpan) * 80,
  }));
}

export default function LiveOperationsMap({ points }: { points: LiveOperationsPoint[] }) {
  if (!points.length) {
    return <EmptyState title="No one has clocked in with location sharing today" description="Points appear here once a team member with location sharing enabled stops a timer session." />;
  }

  const placed = layout(points);
  return <div className="grid gap-5">
    <MapContainer label="Live team locations">
      <div className="relative h-64 w-full">
        {placed.map(({ point, left, top }) => (
          <div key={point.userId} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${left}%`, top: `${top}%` }} title={`${point.name} · ${point.siteName ?? "No site"}`}>
            <SiteMarker label={point.name} />
          </div>
        ))}
      </div>
    </MapContainer>
    <ul className="grid gap-2 sm:grid-cols-2">
      {points.map((point) => (
        <li key={point.userId} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#161A34] p-4">
          <div>
            <p className="font-semibold text-[#E5E7EB]">{point.name}</p>
            <p className="text-sm text-[#9CA3AF]">{point.siteName ?? "No site"} · started {minutesAgo(point.startedAt)}</p>
          </div>
          <GpsBadge latitude={point.latitude} longitude={point.longitude} />
        </li>
      ))}
    </ul>
  </div>;
}
