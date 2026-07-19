import type { NotificationPreference } from "./notification"; import type { UserId } from "./user";
export interface UserSettings { userId: UserId; theme: "system" | "dark" | "light"; notificationPreferences: NotificationPreference[]; defaultCompanyId?: string; compactMode: boolean }
