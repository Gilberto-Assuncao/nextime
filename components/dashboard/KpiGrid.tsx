import type { Kpi } from "@/lib/mock/dashboard";
import KpiCard from "./KpiCard";

export default function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  if (kpis.length === 0) return <div className="rounded-2xl border border-dashed border-white/15 bg-[#161A34] p-8 text-center text-sm text-[#9CA3AF]">No KPI data is available yet.</div>;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}</div>;
}
