import type { Metadata } from "next";
import Link from "next/link";
import { CompaniesList, listCompanies } from "@/src/features/companies";
export const metadata: Metadata={title:"Companies"};
export default async function CompaniesPage(){const companies=await listCompanies();return <div className="space-y-6"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-[#22C55E]">Sprint 3.8 · Company Management</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Companies</h1><p className="mt-2 text-sm text-[#9CA3AF]">Authorized tenant workspaces linked to your account.</p></div><Link href="/dashboard/companies/new" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#22C55E] px-4 font-semibold text-[#07110B]">Create company</Link></header><CompaniesList companies={companies}/></div>;}
