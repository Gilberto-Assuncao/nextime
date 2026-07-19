import UserMenu from "./UserMenu";

export default function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-white/10 bg-[#111827]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button type="button" onClick={onOpenMenu} aria-label="Open navigation" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-white/5 hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E] lg:hidden"><span aria-hidden="true" className="text-xl">☰</span></button>
      <h1 className="hidden text-lg font-semibold text-[#E5E7EB] sm:block">Dashboard</h1>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <label className="relative hidden md:block"><span className="sr-only">Search dashboard</span><span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">⌕</span><input type="search" placeholder="Search" className="min-h-11 w-56 rounded-lg border border-white/10 bg-[#161A34] pl-9 pr-3 text-sm text-[#E5E7EB] outline-none placeholder:text-[#6B7280] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20" /></label>
        <button type="button" aria-label="Notifications" className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-white/5 hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E]"><span aria-hidden="true">♢</span><span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#22C55E]" /></button>
        <UserMenu />
      </div>
    </header>
  );
}
