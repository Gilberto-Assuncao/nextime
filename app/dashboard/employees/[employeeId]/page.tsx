import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EmployeeSummary from "@/components/employees/EmployeeSummary";
import { employees } from "@/lib/mock/employees";
import PageHeader from "@/components/dashboard/PageHeader";

export function generateStaticParams() { return employees.map((employee) => ({ employeeId: employee.id })); }
export async function generateMetadata({ params }: { params: Promise<{ employeeId: string }> }): Promise<Metadata> { const { employeeId } = await params; const employee = employees.find((item) => item.id === employeeId); return { title: employee ? `${employee.firstName} ${employee.lastName}` : "Employee" }; }
export default async function EmployeeDetailsPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = await params; const employee = employees.find((item) => item.id === employeeId); if (!employee) notFound();
  return <section aria-labelledby="employee-heading"><Link href="/dashboard/employees" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#9CA3AF] hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E]">← Back to employees</Link><div className="mb-6 mt-3"><PageHeader headingId="employee-heading" eyebrow="Employee profile" title={`${employee.firstName} ${employee.lastName}`} actions={<><button type="button" className="min-h-11 rounded-lg border border-white/15 px-5 text-sm font-semibold text-[#E5E7EB] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#22C55E]">Edit employee</button><button type="button" className="min-h-11 rounded-lg border border-red-400/30 px-5 text-sm font-semibold text-red-300 hover:bg-red-400/10 focus-visible:outline-2 focus-visible:outline-red-300">Deactivate</button></>} /></div><EmployeeSummary employee={employee} /></section>;
}
