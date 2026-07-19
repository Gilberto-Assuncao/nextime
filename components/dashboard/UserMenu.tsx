export default function UserMenu() {
  return (
    <details className="group relative">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-[#22C55E] [&::-webkit-details-marker]:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E] text-sm font-bold text-[#07110B]">GA</span>
        <span className="hidden text-sm font-medium text-[#E5E7EB] sm:block">Gilberto</span>
        <span aria-hidden="true" className="hidden text-[#9CA3AF] transition-transform group-open:rotate-180 sm:block">⌄</span>
      </summary>
      <div className="absolute right-0 top-12 z-40 w-52 rounded-xl border border-white/10 bg-[#161A34] p-2 shadow-2xl">
        <div className="border-b border-white/10 px-3 py-2"><p className="text-sm font-semibold text-[#E5E7EB]">Gilberto Assunção</p><p className="text-xs text-[#9CA3AF]">Administrator</p></div>
        <button type="button" className="mt-1 flex min-h-11 w-full items-center rounded-lg px-3 text-sm text-[#9CA3AF] hover:bg-white/5 hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Sign Out</button>
      </div>
    </details>
  );
}
