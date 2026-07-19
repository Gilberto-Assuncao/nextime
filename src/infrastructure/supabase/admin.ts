import "server-only"; import { createClient } from "@supabase/supabase-js"; import { getPublicEnvironment, getServiceRoleKey } from "@/src/infrastructure/config/env";
export function createAdminClient() { const env = getPublicEnvironment(); return createClient(env.supabaseUrl, getServiceRoleKey(), { auth: { autoRefreshToken: false, persistSession: false } }); }
