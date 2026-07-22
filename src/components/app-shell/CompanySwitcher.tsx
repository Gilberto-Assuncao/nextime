"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { switchCompanyAction } from "@/app/[locale]/auth/actions";
import type { AppCompanyOption } from "./types";

export function CompanySwitcher({ companies, value }: { companies: AppCompanyOption[]; value?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function changeCompany(companyId: string) {
    setError(null);
    startTransition(async () => {
      const result = await switchCompanyAction(companyId);
      if (!result.ok) {
        setError(result.message ?? "Unable to switch company.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <label htmlFor="company-switcher" className="sr-only">Current company</label>
      <select id="company-switcher" value={value ?? ""} disabled={pending || companies.length === 0} onChange={(event) => changeCompany(event.target.value)} aria-describedby={error ? "company-switcher-error" : undefined} className="min-h-11 w-full max-w-32 rounded-lg border border-white/10 bg-[#111827] px-2 text-xs text-[#E5E7EB] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 disabled:opacity-60 sm:max-w-44 sm:px-3 sm:text-sm">
        {companies.length === 0 ? <option value="">No company</option> : null}
        {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
      </select>
      {error ? <span id="company-switcher-error" role="alert" className="absolute right-0 top-12 w-64 rounded-lg border border-red-400/30 bg-[#161A34] p-2 text-xs text-red-200 shadow-xl">{error}</span> : null}
    </div>
  );
}
