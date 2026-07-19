import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = { title: "Reset Password — NEXTIME" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard title="Reset your password" description="Enter your email and we’ll send instructions to securely reset your password." footer={<Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">← Back to sign in</Link>}>
        <AuthInput id="reset-email" name="email" type="email" label="Email" autoComplete="email" placeholder="you@company.com" required />
        <button type="submit" className="min-h-12 w-full rounded-lg bg-[#22C55E] px-5 py-3 font-semibold text-[#07110B] transition hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">Send reset link</button>
      </AuthCard>
    </AuthLayout>
  );
}
