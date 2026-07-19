import Link from "next/link";
import EmployeeTable from "@/components/employees/EmployeeTable";
import { employees, employeeTeams } from "@/lib/mock/employees";

export default function EmployeesPage() {
  return <section aria-labelledby="employees-heading"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">Team</p><h2 id="employees-heading" className="mt-2 text-2xl font-bold text-[#E5E7EB] sm:text-3xl">Employees</h2><p className="mt-2 text-sm text-[#9CA3AF]">{employees.length} employees in your workspace</p></div><Link href="/dashboard/employees/new" className="flex min-h-11 items-center justify-center rounded-lg bg-[#22C55E] px-5 text-sm font-semibold text-[#07110B] hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">Add employee</Link></div><EmployeeTable employees={employees} teams={employeeTeams} /></section>;
}
