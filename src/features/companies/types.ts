export type ManagedCompanyStatus = "active" | "inactive" | "suspended" | "archived";
export type CompanyPermission = "view" | "edit_profile" | "edit_settings" | "archive" | "reactivate";

export interface CompanyFormValues {
  legalName: string;
  displayName: string;
  registrationNumber: string;
  vatNumber: string;
  countryCode: string;
  defaultLanguage: string;
  timezone: string;
  currencyCode: string;
  phone: string;
  email: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  region: string;
}

export interface CompanySettingsValues {
  defaultLanguage: string;
  timezone: string;
  currencyCode: string;
  dateFormat: string;
  timeFormat: string;
  weekStartsOn: string;
  status: ManagedCompanyStatus;
}

export interface CompanySummary {
  id: string;
  displayName: string;
  legalName: string;
  slug: string | null;
  status: ManagedCompanyStatus;
  countryCode: string;
  city: string;
  createdAt: string;
  roles: string[];
}

export interface CompanyDetail extends CompanySummary, CompanyFormValues {
  logoUrl: string | null;
  settings: CompanySettingsValues;
  permissions: CompanyPermission[];
  memberCounts: { total: number; active: number; invited: number; suspended: number };
  teamCounts: { total: number; active: number; leaders: number; members: number };
  activeProjects: number;
}

export interface CompanyActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof CompanyFormValues | keyof CompanySettingsValues, string>>;
}

export const initialCompanyActionState: CompanyActionState = { status: "idle" };
