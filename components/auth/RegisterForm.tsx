"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/[locale]/auth/actions";
import { initialAuthState } from "@/app/[locale]/auth/state";
import AuthCard from "./AuthCard";
import AuthDivider from "./AuthDivider";
import AuthInput from "./AuthInput";
import AuthStatus from "./AuthStatus";
import AuthSubmitButton from "./AuthSubmitButton";
import PasswordInput from "./PasswordInput";
import SocialAuthButtons from "./SocialAuthButtons";

export default function RegisterForm() {
  const [state, action] = useActionState(registerAction, initialAuthState);
  return (
    <AuthCard action={action} title="Create your account" description="Start managing time with a workspace designed around how you work." footer={<>Already have an account? <Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Sign In</Link></>}>
      <fieldset><legend className="mb-2 text-sm font-medium text-[#E5E7EB]">Account type</legend><div className="grid grid-cols-2 gap-3">{["Individual", "Company"].map((type) => <label key={type} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#111827] px-3 text-sm font-medium has-checked:border-[#22C55E] has-checked:bg-[#22C55E]/10"><input type="radio" name="accountType" value={type.toLowerCase()} defaultChecked={type === "Individual"} className="h-4 w-4 accent-[#22C55E]" />{type}</label>)}</div></fieldset>
      <AuthInput id="full-name" name="fullName" type="text" label="Full name" autoComplete="name" placeholder="Your full name" required />
      <AuthInput id="register-email" name="email" type="email" label="Work email" autoComplete="email" placeholder="you@company.com" required />
      <PasswordInput id="register-password" name="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" />
      <PasswordInput id="confirm-password" name="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" />
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#D1D5DB]"><input type="checkbox" name="terms" required className="mt-1 h-5 w-5 shrink-0 rounded border-white/20 accent-[#22C55E]" /><span>I agree to the <a href="#" className="font-medium text-[#22C55E] hover:text-[#16A34A]">Terms of Service</a> and <a href="#" className="font-medium text-[#22C55E] hover:text-[#16A34A]">Privacy Policy</a>.</span></label>
      <AuthStatus state={state} />
      <AuthSubmitButton pendingLabel="Creating account…">Create account</AuthSubmitButton>
      <AuthDivider />
      <SocialAuthButtons />
    </AuthCard>
  );
}
