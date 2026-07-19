import Link from "next/link";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { employeeTeams } from "@/lib/mock/employees";

export default function NewEmployeePage() { return <section aria-labelledby="new-employee-heading" className="mx-auto max-w-4xl"><Link href="/dashboard/employees" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#9CA3AF] hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E]">← Back to employees</Link><div className="mb-6 mt-3"><h2 id="new-employee-heading" className="text-2xl font-bold text-[#E5E7EB] sm:text-3xl">Add employee</h2><p className="mt-2 text-sm leading-6 text-[#9CA3AF]">Enter the employee’s work details to prepare an invitation.</p></div><EmployeeForm teams={employeeTeams} /></section>; }
