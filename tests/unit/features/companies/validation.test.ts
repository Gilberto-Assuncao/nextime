import { describe, expect, it } from "vitest";
import { validateCompanyForm, validateSettingsForm } from "@/src/features/companies/validation";

function formData(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const validCompany = {
  legalName: "Belnex Energy SRL",
  displayName: "Belnex Energy",
  countryCode: "BE",
  defaultLanguage: "en",
  timezone: "Europe/Brussels",
  currencyCode: "EUR",
};

describe("validateCompanyForm", () => {
  it("accepts a minimally valid submission", () => {
    const result = validateCompanyForm(formData(validCompany));
    expect(result.error).toBeUndefined();
    expect(result.data?.displayName).toBe("Belnex Energy");
  });

  it("rejects a display name shorter than 2 characters", () => {
    const result = validateCompanyForm(formData({ ...validCompany, displayName: "B" }));
    expect(result.data).toBeUndefined();
    expect(result.error?.fieldErrors?.displayName).toBeDefined();
  });

  it("rejects a country code that isn't two letters", () => {
    // The field is truncated to 2 characters before validation, so a
    // too-long code like "BEL" would just become the valid "BE" — use a
    // 2-character non-letter value to actually exercise the regex check.
    const result = validateCompanyForm(formData({ ...validCompany, countryCode: "12" }));
    expect(result.error?.fieldErrors?.countryCode).toBeDefined();
  });

  it("rejects an unsupported default language", () => {
    const result = validateCompanyForm(formData({ ...validCompany, defaultLanguage: "xx" }));
    expect(result.error?.fieldErrors?.defaultLanguage).toBeDefined();
  });

  it("rejects an invalid IANA timezone", () => {
    const result = validateCompanyForm(formData({ ...validCompany, timezone: "Not/A_Zone" }));
    expect(result.error?.fieldErrors?.timezone).toBeDefined();
  });

  it("rejects a malformed email when one is provided", () => {
    const result = validateCompanyForm(formData({ ...validCompany, email: "not-an-email" }));
    expect(result.error?.fieldErrors?.email).toBeDefined();
  });

  it("accepts an empty email (optional field)", () => {
    const result = validateCompanyForm(formData(validCompany));
    expect(result.error?.fieldErrors?.email).toBeUndefined();
  });

  it("rejects a website that isn't http(s)", () => {
    const result = validateCompanyForm(formData({ ...validCompany, website: "ftp://example.com" }));
    expect(result.error?.fieldErrors?.website).toBeDefined();
  });

  it("normalizes currency code to uppercase", () => {
    const result = validateCompanyForm(formData({ ...validCompany, currencyCode: "eur" }));
    expect(result.data?.currencyCode).toBe("EUR");
  });
});

const validSettings = {
  defaultLanguage: "en",
  timezone: "Europe/Brussels",
  currencyCode: "EUR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  weekStartsOn: "1",
  status: "active",
  graceMinutes: "15",
};

describe("validateSettingsForm", () => {
  it("accepts a minimally valid submission", () => {
    const result = validateSettingsForm(formData(validSettings));
    expect(result.error).toBeUndefined();
  });

  it("rejects a grace period over 180 minutes", () => {
    const result = validateSettingsForm(formData({ ...validSettings, graceMinutes: "181" }));
    expect(result.error?.fieldErrors?.graceMinutes).toBeDefined();
  });

  it("requires an expected start time when reminders are enabled", () => {
    const result = validateSettingsForm(formData({ ...validSettings, punctualityRemindersEnabled: "on" }));
    expect(result.error?.fieldErrors?.expectedStartTime).toBeDefined();
  });

  it("accepts reminders enabled alongside a valid expected start time", () => {
    const result = validateSettingsForm(formData({ ...validSettings, punctualityRemindersEnabled: "on", expectedStartTime: "08:00" }));
    expect(result.error).toBeUndefined();
    expect(result.data?.punctualityRemindersEnabled).toBe(true);
  });
});
