"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigation } from "@/lib/config/dashboard-navigation";

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-1">
        {dashboardNavigation.map(({ label, href, iconPath }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#22C55E] ${active ? "bg-[#22C55E]/12 text-[#22C55E]" : "text-[#9CA3AF] hover:bg-white/5 hover:text-[#E5E7EB]"}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true"><path d={iconPath} /></svg>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
