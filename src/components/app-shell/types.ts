import type { IconName } from "@/src/components/ui";
export interface AppNavigationItem { id: string; label: string; href: string; icon?: IconName; badge?: string; disabled?: boolean; children?: AppNavigationItem[]; section?: string; roles?: string[] }
export interface AppCompanyOption { id: string; name: string; logo?: string }
export interface AppUserSummary { name: string; email: string; initials: string }
export interface AppNotification { id: string; title: string; description: string; timestamp: string; unread?: boolean }
export interface QuickAction { id: string; label: string; href: string; icon?: IconName }
