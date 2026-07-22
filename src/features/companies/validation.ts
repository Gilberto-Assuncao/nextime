import type { CompanyActionState, CompanyFormValues, CompanySettingsValues, ManagedCompanyStatus } from "./types";

const languages = ["en", "fr", "nl", "de", "pt"];
const statuses: ManagedCompanyStatus[] = ["active", "inactive", "suspended", "archived"];

function value(formData: FormData, key: string, max = 160) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function isUrl(input: string) {
  if (!input) return true;
  try { const url = new URL(input); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

function isTimezone(input: string) {
  try { new Intl.DateTimeFormat("en", { timeZone: input }).format(); return true; } catch { return false; }
}

export function validateCompanyForm(formData: FormData): { data?: CompanyFormValues; error?: CompanyActionState } {
  const data: CompanyFormValues = {
    legalName: value(formData, "legalName"), displayName: value(formData, "displayName"),
    registrationNumber: value(formData, "registrationNumber", 64), vatNumber: value(formData, "vatNumber", 64),
    countryCode: value(formData, "countryCode", 2).toUpperCase(), defaultLanguage: value(formData, "defaultLanguage", 5).toLowerCase(),
    timezone: value(formData, "timezone", 64), currencyCode: value(formData, "currencyCode", 3).toUpperCase(),
    phone: value(formData, "phone", 32), email: value(formData, "email", 254).toLowerCase(), website: value(formData, "website", 256),
    addressLine1: value(formData, "addressLine1"), addressLine2: value(formData, "addressLine2"), postalCode: value(formData, "postalCode", 24),
    city: value(formData, "city", 100), region: value(formData, "region", 100),
  };
  const fieldErrors: CompanyActionState["fieldErrors"] = {};
  if (data.legalName.length < 2) fieldErrors.legalName = "Legal name must contain at least 2 characters.";
  if (data.displayName.length < 2) fieldErrors.displayName = "Display name must contain at least 2 characters.";
  if (!/^[A-Z]{2}$/.test(data.countryCode)) fieldErrors.countryCode = "Use a two-letter country code.";
  if (!languages.includes(data.defaultLanguage)) fieldErrors.defaultLanguage = "Select a supported language.";
  if (!isTimezone(data.timezone)) fieldErrors.timezone = "Use a valid IANA timezone.";
  if (!/^[A-Z]{3}$/.test(data.currencyCode)) fieldErrors.currencyCode = "Use a three-letter ISO currency code.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fieldErrors.email = "Enter a valid email address.";
  if (!isUrl(data.website)) fieldErrors.website = "Use a valid http or https URL.";
  if (data.phone && !/^[+()\d\s.-]{6,32}$/.test(data.phone)) fieldErrors.phone = "Enter a structurally valid phone number.";
  if (data.vatNumber && !/^[A-Z0-9 .-]{3,64}$/i.test(data.vatNumber)) fieldErrors.vatNumber = "VAT number contains unsupported characters.";
  if (data.registrationNumber && !/^[A-Z0-9 ./-]{2,64}$/i.test(data.registrationNumber)) fieldErrors.registrationNumber = "Registration number contains unsupported characters.";
  return Object.keys(fieldErrors).length ? { error: { status: "error", message: "Review the highlighted fields.", fieldErrors } } : { data };
}

export function validateSettingsForm(formData: FormData): { data?: CompanySettingsValues; error?: CompanyActionState } {
  const data: CompanySettingsValues = {
    defaultLanguage: value(formData, "defaultLanguage", 5).toLowerCase(), timezone: value(formData, "timezone", 64),
    currencyCode: value(formData, "currencyCode", 3).toUpperCase(), dateFormat: value(formData, "dateFormat", 16),
    timeFormat: value(formData, "timeFormat", 3), weekStartsOn: value(formData, "weekStartsOn", 1), status: value(formData, "status", 16) as ManagedCompanyStatus,
    expectedStartTime: value(formData, "expectedStartTime", 5), expectedEndTime: value(formData, "expectedEndTime", 5),
    graceMinutes: value(formData, "graceMinutes", 4), punctualityRemindersEnabled: formData.get("punctualityRemindersEnabled") === "on",
  };
  const fieldErrors: CompanyActionState["fieldErrors"] = {};
  if (!languages.includes(data.defaultLanguage)) fieldErrors.defaultLanguage = "Select a supported language.";
  if (!isTimezone(data.timezone)) fieldErrors.timezone = "Use a valid IANA timezone.";
  if (!/^[A-Z]{3}$/.test(data.currencyCode)) fieldErrors.currencyCode = "Use an ISO currency code.";
  if (!["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].includes(data.dateFormat)) fieldErrors.dateFormat = "Select a supported date format.";
  if (!["12h", "24h"].includes(data.timeFormat)) fieldErrors.timeFormat = "Select a supported time format.";
  if (!["0", "1", "6"].includes(data.weekStartsOn)) fieldErrors.weekStartsOn = "Select a supported first day.";
  if (!statuses.includes(data.status)) fieldErrors.status = "Select a valid company status.";
  if (data.expectedStartTime && !/^\d{2}:\d{2}$/.test(data.expectedStartTime)) fieldErrors.expectedStartTime = "Use HH:MM format.";
  if (data.expectedEndTime && !/^\d{2}:\d{2}$/.test(data.expectedEndTime)) fieldErrors.expectedEndTime = "Use HH:MM format.";
  if (!/^\d{1,3}$/.test(data.graceMinutes) || Number(data.graceMinutes) > 180) fieldErrors.graceMinutes = "Enter a grace period between 0 and 180 minutes.";
  if (data.punctualityRemindersEnabled && (!data.expectedStartTime)) fieldErrors.expectedStartTime = "Set an expected start time to enable reminders.";
  return Object.keys(fieldErrors).length ? { error: { status: "error", message: "Review the highlighted fields.", fieldErrors } } : { data };
}
