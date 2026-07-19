import type { EmployeeStatus } from "@/lib/types/employee";

const styles: Record<EmployeeStatus, string> = { active: "bg-[#22C55E]/10 text-[#4ADE80]", invited: "bg-sky-400/10 text-sky-300", inactive: "bg-white/10 text-[#9CA3AF]" };
const labels: Record<EmployeeStatus, string> = { active: "Active", invited: "Invited", inactive: "Inactive" };
export default function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) { return <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>; }
