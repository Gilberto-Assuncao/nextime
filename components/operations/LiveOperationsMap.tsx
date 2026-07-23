"use client";

import { useState } from "react";
import { MapContainer, GpsBadge } from "@/src/components/maps";
import { Icon } from "@/src/components/ui";
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
  const [selected, setSelected] = useState<string | null>(null);

  if (!points.length) {
    return <EmptyState title="No one has clocked in with location sharing today" description="Points appear here once a team member with location sharing enabled stops a timer session." />;
  }

  const placed = layout(points);
  return (
    <div className="grid gap-5">
      <MapContainer label="Live team locations">
        <div className="relative h-72 w-full">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={placed.map(({ left, top }) => `${left},${top}`).join(" ")}
              fill="none"
              stroke="rgba(74, 222, 128, 0.35)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          </svg>
          {placed.map(({ point, left, top }) => {
            const isSelected = selected === point.userId;
            return (
              <button
                key={point.userId}
                type="button"
                onClick={() => setSelected(isSelected ? null : point.userId)}
                className="absolute -translate-x-1/2 -translate-y-full cursor-pointer bg-transparent p-0"
                style={{ left: `${left}%`, top: `${top}%`, zIndex: isSelected ? 20 : 10 }}
              >
                <span
                  role="img"
                  aria-label={point.name}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-[#07110B] shadow-lg transition-transform ${
                    isSelected ? "scale-125 bg-[#4ADE80] ring-4 ring-[#4ADE80]/40" : "bg-[#22C55E]"
                  }`}
                >
                  <Icon name="location" />
                </span>
                <span className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0F172A] px-2 py-1 text-xs font-medium text-[#E5E7EB] shadow transition-opacity ${isSelected ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                  {point.name}
                </span>
              </button>
            );
          })}
        </div>
      </MapContainer>
      <ul className="grid gap-2 sm:grid-cols-2">
        {points.map((point) => {
          const isSelected = selected === point.userId;
          return (
            <li key={point.userId}>
              <button
                type="button"
                onClick={() => setSelected(isSelected ? null : point.userId)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                  isSelected ? "border-[#22C55E]/50 bg-[#22C55E]/10" : "border-white/10 bg-[#161A34] hover:bg-white/5"
                }`}
              >
                <div>
                  <p className="font-semibold text-[#E5E7EB]">{point.name}</p>
                  <p className="text-sm text-[#9CA3AF]">{point.siteName ?? "No site"} · started {minutesAgo(point.startedAt)}</p>
                </div>
                <GpsBadge latitude={point.latitude} longitude={point.longitude} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
