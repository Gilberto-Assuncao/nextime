"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/[locale]/auth/actions";
import { initialAuthState } from "@/app/[locale]/auth/state";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthStatus from "./AuthStatus";
import AuthSubmitButton from "./AuthSubmitButton";

export default function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordResetAction, initialAuthState);
  return (
    <AuthCard action={action} title="Reset your password" description="Enter your email and we’ll send instructions to securely reset your password." footer={<Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">← Back to sign in</Link>}>
      <AuthInput id="reset-email" name="email" type="email" label="Email" autoComplete="email" placeholder="you@company.com" required />
      <AuthStatus state={state} />
      <AuthSubmitButton pendingLabel="Sending…">Send reset link</AuthSubmitButton>
    </AuthCard>
  );
}
