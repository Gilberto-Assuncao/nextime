import Link from "next/link";
import { CompanyCard } from "@/src/components/cards";
import { CompanyStatusBadge } from "./CompanyStatusBadge";
import type { CompanySummary } from "../types";

export function CompaniesList({ companies }: { companies: CompanySummary[] }) {
  if (!companies.length) return <section className="rounded-2xl border border-dashed border-white/15 bg-[#161A34] p-8 text-center"><h2 className="text-xl font-semibold">No companies yet</h2><p className="mt-2 text-sm text-[#9CA3AF]">Create a company to establish your first tenant workspace.</p><Link href="/dashboard/companies/new" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#22C55E] px-4 font-semibold text-[#07110B]">Create company</Link></section>;
  return <section aria-label="Your companies" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{companies.map(company=><CompanyCard key={company.id} title={company.displayName} subtitle={company.roles.join(", ")||"Member"} status={company.status} metadata={<div className="flex items-center justify-between gap-3"><span>{company.countryCode??"Authorized company"}</span><CompanyStatusBadge status={company.status}/></div>} action={<Link href={`/dashboard/companies/${company.id}`} className="inline-flex min-h-11 items-center font-semibold text-[#22C55E]">View company →</Link>}/>)}</section>;
}
