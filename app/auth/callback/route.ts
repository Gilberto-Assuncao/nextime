import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/src/infrastructure/supabase/server";
import { hasPublicEnvironment } from "@/src/infrastructure/config/env";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export async function GET(request: NextRequest) {
  if (!hasPublicEnvironment()) return NextResponse.redirect(new URL("/login?error=configuration", request.url));
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(new URL("/login?error=callback", request.url));
}
