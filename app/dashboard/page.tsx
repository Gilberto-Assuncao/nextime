export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-heading">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">Overview</p>
        <h2 id="dashboard-heading" className="mt-2 text-2xl font-bold tracking-tight text-[#E5E7EB] sm:text-3xl">Dashboard</h2>
        <p className="mt-2 text-sm text-[#9CA3AF] sm:text-base">Welcome back, Gilberto.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard content coming soon">
        {["Hours overview", "Team activity", "Pending approvals", "Active projects"].map((label) => <div key={label} className="min-h-32 rounded-2xl border border-white/10 bg-[#161A34] p-5"><div className="h-3 w-24 rounded-full bg-white/10" /><div className="mt-6 h-8 w-20 rounded-lg bg-white/5" /><p className="sr-only">{label} placeholder</p></div>)}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="min-h-72 rounded-2xl border border-dashed border-white/10 bg-[#161A34]/60 p-6"><p className="text-sm font-medium text-[#6B7280]">Dashboard insights will appear here.</p></div>
        <div className="min-h-72 rounded-2xl border border-dashed border-white/10 bg-[#161A34]/60 p-6"><p className="text-sm font-medium text-[#6B7280]">Recent activity will appear here.</p></div>
      </div>
    </section>
  );
}
