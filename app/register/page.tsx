import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

export const metadata: Metadata = { title: "Create Account — NEXTIME" };

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard title="Create your account" description="Start managing time with a workspace designed around how you work." footer={<>Already have an account? <Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Sign In</Link></>}>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-[#E5E7EB]">Account type</legend>
          <div className="grid grid-cols-2 gap-3">
            {['Individual', 'Company'].map((type) => <label key={type} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#111827] px-3 text-sm font-medium has-checked:border-[#22C55E] has-checked:bg-[#22C55E]/10"><input type="radio" name="accountType" value={type.toLowerCase()} defaultChecked={type === 'Individual'} className="h-4 w-4 accent-[#22C55E]" />{type}</label>)}
          </div>
        </fieldset>
        <AuthInput id="full-name" name="fullName" type="text" label="Full name" autoComplete="name" placeholder="Your full name" required />
        <AuthInput id="register-email" name="email" type="email" label="Work email" autoComplete="email" placeholder="you@company.com" required />
        <PasswordInput id="register-password" name="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" />
        <PasswordInput id="confirm-password" name="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" />
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#D1D5DB]"><input type="checkbox" name="terms" required className="mt-1 h-5 w-5 shrink-0 rounded border-white/20 accent-[#22C55E]" /><span>I agree to the <a href="#" className="font-medium text-[#22C55E] hover:text-[#16A34A]">Terms of Service</a> and <a href="#" className="font-medium text-[#22C55E] hover:text-[#16A34A]">Privacy Policy</a>.</span></label>
        <button type="submit" className="min-h-12 w-full rounded-lg bg-[#22C55E] px-5 py-3 font-semibold text-[#07110B] transition hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">Create account</button>
        <AuthDivider />
        <SocialAuthButtons />
      </AuthCard>
    </AuthLayout>
  );
}
