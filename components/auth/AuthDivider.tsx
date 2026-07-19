export default function AuthDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-xs uppercase tracking-[0.16em] text-[#6B7280]">or</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}
