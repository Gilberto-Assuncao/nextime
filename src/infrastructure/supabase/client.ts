"use client";
import { createBrowserClient } from "@supabase/ssr"; import { getPublicEnvironment } from "@/src/infrastructure/config/env";
export function createClient() { const env = getPublicEnvironment(); return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey); }
