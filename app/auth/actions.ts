"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/src/infrastructure/supabase/server";
import { ACTIVE_COMPANY_COOKIE } from "@/src/application/session/types";
import { hasPublicEnvironment } from "@/src/infrastructure/config/env";
import type { AuthActionState } from "./state";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

async function origin() {
  const requestHeaders = await headers();
  return requestHeaders.get("origin") ?? process.env.APP_URL ?? "http://localhost:3000";
}

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!hasPublicEnvironment()) return { status: "error", message: "Authentication is not configured in this environment." };
  const email = text(formData, "email");
  const password = text(formData, "password");
  const next = safeNext(text(formData, "next") || "/dashboard");
  if (!email || !password) return { status: "error", message: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: "The email or password is incorrect." };
  redirect(next);
}

export async function registerAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!hasPublicEnvironment()) return { status: "error", message: "Authentication is not configured in this environment." };
  const fullName = text(formData, "fullName");
  const email = text(formData, "email");
  const password = text(formData, "password");
  const confirmation = text(formData, "confirmPassword");
  const accountType = text(formData, "accountType");

  if (fullName.length < 2 || !email || password.length < 8) {
    return { status: "error", message: "Use a valid name, email, and a password with at least 8 characters." };
  }
  if (password !== confirmation) return { status: "error", message: "Passwords do not match." };
  if (formData.get("terms") !== "on") return { status: "error", message: "Accept the Terms and Privacy Policy to continue." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${await origin()}/auth/callback?next=/dashboard`,
      data: { full_name: fullName, account_type: accountType },
    },
  });

  if (error) return { status: "error", message: error.message };
  if (data.session) redirect("/dashboard");
  return { status: "success", message: "Check your inbox to confirm your account." };
}

export async function requestPasswordResetAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!hasPublicEnvironment()) return { status: "error", message: "Authentication is not configured in this environment." };
  const email = text(formData, "email");
  if (!email) return { status: "error", message: "Enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origin()}/auth/callback?next=/reset-password`,
  });
  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "If the account exists, reset instructions have been sent." };
}

export async function updatePasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!hasPublicEnvironment()) return { status: "error", message: "Authentication is not configured in this environment." };
  const password = text(formData, "password");
  const confirmation = text(formData, "confirmPassword");
  if (password.length < 8) return { status: "error", message: "Use at least 8 characters." };
  if (password !== confirmation) return { status: "error", message: "Passwords do not match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Password updated. You can now sign in." };
}

export async function signOutAction() {
  if (!hasPublicEnvironment()) {
    (await cookies()).delete(ACTIVE_COMPANY_COOKIE);
    redirect("/login");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  (await cookies()).delete(ACTIVE_COMPANY_COOKIE);
  redirect("/login");
}

export async function switchCompanyAction(companyId: string): Promise<{ ok: boolean; message?: string }> {
  if (!hasPublicEnvironment()) return { ok: false, message: "Authentication is not configured in this environment." };
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "Your session has expired." };

  const { data: membership } = await supabase
    .from("company_memberships")
    .select("id, companies!inner(status)")
    .eq("company_id", companyId)
    .eq("user_id", userData.user.id)
    .eq("status", "active")
    .neq("companies.status", "archived")
    .maybeSingle();

  if (!membership) return { ok: false, message: "You do not have access to this company." };

  (await cookies()).set(ACTIVE_COMPANY_COOKIE, companyId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
