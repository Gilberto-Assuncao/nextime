import type { ManagedCompanyStatus } from "../types";

const styles: Record<ManagedCompanyStatus, string> = {
  active: "border-green-400/30 bg-green-400/10 text-green-200",
  inactive: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  suspended: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  archived: "border-purple-400/30 bg-purple-400/10 text-purple-200",
};

export function CompanyStatusBadge({ status }: { status: ManagedCompanyStatus }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}><span aria-hidden="true" className="mr-1.5">●</span>{status}</span>;
}
