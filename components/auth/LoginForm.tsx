"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction } from "@/app/auth/actions";
import { initialAuthState, type AuthActionState } from "@/app/auth/state";
import AuthCard from "./AuthCard";
import AuthDivider from "./AuthDivider";
import AuthInput from "./AuthInput";
import AuthStatus from "./AuthStatus";
import AuthSubmitButton from "./AuthSubmitButton";
import PasswordInput from "./PasswordInput";
import SocialAuthButtons from "./SocialAuthButtons";

export default function LoginForm({ next = "/dashboard", callbackError = false }: { next?: string; callbackError?: boolean }) {
  const initialState: AuthActionState = callbackError
    ? { status: "error", message: "The authentication callback could not be completed." }
    : initialAuthState;
  const [state, action] = useActionState(signInAction, initialState);
  return (
    <AuthCard action={action} title="Welcome back" description="Sign in to manage your time, projects, and teams." footer={<>New to NEXTIME? <Link href="/register" className="inline-flex min-h-11 items-center font-semibold text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Create account</Link></>}>
      <input type="hidden" name="next" value={next} />
      <AuthInput id="login-email" name="email" type="email" label="Email" autoComplete="email" placeholder="you@company.com" required />
      <PasswordInput id="login-password" name="password" label="Password" autoComplete="current-password" placeholder="Enter your password" />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[#D1D5DB]"><input type="checkbox" name="remember" className="h-5 w-5 rounded border-white/20 accent-[#22C55E]" />Remember me</label>
        <Link href="/forgot-password" className="inline-flex min-h-11 items-center font-medium text-[#22C55E] hover:text-[#16A34A] focus-visible:outline-2 focus-visible:outline-[#22C55E]">Forgot password?</Link>
      </div>
      <AuthStatus state={state} />
      <AuthSubmitButton pendingLabel="Signing in…">Sign In</AuthSubmitButton>
      <AuthDivider />
      <SocialAuthButtons />
    </AuthCard>
  );
}
