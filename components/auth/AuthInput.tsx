import type { ComponentPropsWithoutRef } from "react";

type AuthInputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
};

export default function AuthInput({ label, id, className = "", ...props }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#E5E7EB]">{label}</label>
      <input
        id={id}
        {...props}
        className={`min-h-12 w-full rounded-lg border border-white/15 bg-[#111827] px-4 py-3 text-base text-[#E5E7EB] outline-none transition placeholder:text-[#6B7280] hover:border-white/25 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 user-invalid:border-red-400 user-invalid:ring-2 user-invalid:ring-red-400/15 ${className}`}
      />
    </div>
  );
}
