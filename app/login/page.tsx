import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

export const metadata: Metadata = { title: "Sign In — NEXTIME" };

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard title="Welcome back" description="Sign in to manage your time, projects, and teams." footer={<>New to NEXTIME? <Link href="/register" className="inline-flex min-h-11 items-center font-semibold text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Create account</Link></>}>
        <AuthInput id="login-email" name="email" type="email" label="Email" autoComplete="email" placeholder="you@company.com" required />
        <PasswordInput id="login-password" name="password" label="Password" autoComplete="current-password" placeholder="Enter your password" />
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[#D1D5DB]"><input type="checkbox" name="remember" className="h-5 w-5 rounded border-white/20 accent-[#22C55E]" />Remember me</label>
          <Link href="/forgot-password" className="inline-flex min-h-11 items-center font-medium text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Forgot password?</Link>
        </div>
        {/* TODO: Protect dashboard routes when backend authentication is integrated. */}
        <Link href="/dashboard" className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#22C55E] px-5 py-3 font-semibold text-[#07110B] transition hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">Sign In</Link>
        <AuthDivider />
        <SocialAuthButtons />
      </AuthCard>
    </AuthLayout>
  );
}
