import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireAuthenticatedSession } from "@/src/application/session/server";
import type { AppNotification } from "@/src/components/app-shell/types";

function relativeTime(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 60 / 24)}d ago`;
}

export async function getNotifications(): Promise<AppNotification[]> {
  const session = await requireAuthenticatedSession();
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id,title,message,read_at,created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []).map((row) => ({
    id: row.id, title: row.title, description: row.message,
    timestamp: relativeTime(row.created_at), unread: row.read_at === null,
  }));
}
