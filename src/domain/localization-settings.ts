import type { CompanyId } from "./company"; import type { UserId } from "./user";
export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
export interface LocalizationSettings { userId?: UserId; companyId?: CompanyId; language: string; timezone: string; locale: string; dateFormat: DateFormat; currency: string }
