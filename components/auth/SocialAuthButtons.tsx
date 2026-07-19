const providers = [
  { name: "Google", mark: "G" },
  { name: "Apple", mark: "●" },
  { name: "Microsoft", mark: "⊞" },
];

export default function SocialAuthButtons() {
  return (
    <div className="grid gap-3">
      {providers.map(({ name, mark }) => (
        <button key={name} type="button" className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-[#111827] px-4 py-3 text-sm font-semibold text-[#E5E7EB] transition hover:border-white/30 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center font-bold text-[#E5E7EB]">{mark}</span>
          Continue with {name}
        </button>
      ))}
    </div>
  );
}
