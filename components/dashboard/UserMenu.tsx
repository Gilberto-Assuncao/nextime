import { requireAuthenticatedSession } from "@/src/application/session/server";

function formatRole(role: string | undefined): string {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Member";
}

export default async function UserMenu() {
  const { user, activeCompany } = await requireAuthenticatedSession();
  const role = formatRole(activeCompany?.roles[0]);
  const firstName = user.name.split(" ")[0];

  return (
    <details className="group relative">
      <summary aria-label="Open user menu" className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-[#22C55E] [&::-webkit-details-marker]:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E] text-sm font-bold text-[#07110B]">{user.initials}</span>
        <span className="hidden text-sm font-medium text-[#E5E7EB] sm:block">{firstName}</span>
        <span aria-hidden="true" className="hidden text-[#9CA3AF] transition-transform group-open:rotate-180 sm:block">⌄</span>
      </summary>
      <div className="absolute right-0 top-12 z-40 w-52 rounded-xl border border-white/10 bg-[#161A34] p-2 shadow-2xl">
        <div className="border-b border-white/10 px-3 py-2"><p className="text-sm font-semibold text-[#E5E7EB]">{user.name}</p><p className="text-xs text-[#9CA3AF]">{role}</p></div>
        <button type="button" className="mt-1 flex min-h-11 w-full items-center rounded-lg px-3 text-sm text-[#9CA3AF] hover:bg-white/5 hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Sign Out</button>
      </div>
    </details>
  );
}
