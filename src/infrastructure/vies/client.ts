import "server-only";

// VIES (VAT Information Exchange System, European Commission) — the free,
// official EU route to validate a VAT number and retrieve the registered
// legal name/address. Chosen over scraping kbopub.economie.fgov.be (decided
// in docs/02-architecture/COMPANY_MANAGEMENT.md): that page is human-facing
// HTML with no stability guarantee, while this is a documented REST API.
// It also generalizes to any EU country, not just Belgium.
interface ViesResponse {
  isValid: boolean;
  name: string;
  address: string;
  userError: string;
}

export type VatLookupResult =
  | { valid: true; legalName: string; addressLine1: string; postalCode: string; city: string }
  | { valid: false; message: string };

function parseAddress(address: string): { addressLine1: string; postalCode: string; city: string } {
  const [street = "", locality = ""] = address.split("\n").map((line) => line.trim());
  const match = locality.match(/^(\S+)\s+(.+)$/);
  return { addressLine1: street, postalCode: match?.[1] ?? "", city: match?.[2] ?? locality };
}

export async function lookupVat(countryCode: string, vatNumber: string): Promise<VatLookupResult> {
  const digits = vatNumber.replace(/\D/g, "");
  if (!countryCode || !digits) return { valid: false, message: "Enter a country and VAT number first." };

  let response: Response;
  try {
    response = await fetch(`https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode}/vat/${digits}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    return { valid: false, message: "VIES is unreachable right now. Enter the company details manually." };
  }
  if (!response.ok) return { valid: false, message: "VIES is unreachable right now. Enter the company details manually." };

  const data = (await response.json()) as ViesResponse;
  if (!data.isValid) return { valid: false, message: data.userError === "INVALID" ? "This VAT number was not found." : "This VAT number could not be validated." };
  if (!data.name || data.name === "---") return { valid: false, message: "VIES confirmed the VAT number but did not return a company name." };

  const { addressLine1, postalCode, city } = parseAddress(data.address ?? "");
  return { valid: true, legalName: data.name, addressLine1, postalCode, city };
}
