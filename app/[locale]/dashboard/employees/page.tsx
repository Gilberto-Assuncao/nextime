import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import EmployeeTable from "@/components/employees/EmployeeTable";
import { getEmployees } from "@/src/features/employees/data";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "Employees" };

export default async function EmployeesPage() {
  const [{ employees, teamNames }, t] = await Promise.all([getEmployees(), getTranslations("employees")]);
  return <section aria-labelledby="employees-heading"><PageHeader headingId="employees-heading" eyebrow={t("eyebrow")} title={t("title")} description={t("employeeCountDescription", { count: employees.length })} actions={<Link href="/dashboard/employees/new" className="flex min-h-11 items-center justify-center rounded-lg bg-[#22C55E] px-5 text-sm font-semibold text-[#07110B] hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">{t("addEmployee")}</Link>} /><EmployeeTable employees={employees} teams={teamNames} /></section>;
}
