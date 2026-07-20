"use client";

import { useFormStatus } from "react-dom";

export default function AuthSubmitButton({ children, pendingLabel }: { children: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="min-h-12 w-full rounded-lg bg-[#22C55E] px-5 py-3 font-semibold text-[#07110B] transition hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E] disabled:cursor-wait disabled:opacity-70">
      {pending ? pendingLabel : children}
    </button>
  );
}
