"use client";

import { useActionState } from "react";
import { EmailInput, Input, PhoneInput, Select } from "@/src/components/forms";
import { createCompanyAction, updateCompanyAction } from "../actions";
import { initialCompanyActionState, type CompanyFormValues } from "../types";
import { CompanyFormStatus } from "./CompanyFormStatus";
import { CompanySubmitButton } from "./CompanySubmitButton";

const empty: CompanyFormValues = { legalName:"",displayName:"",registrationNumber:"",vatNumber:"",countryCode:"BE",defaultLanguage:"en",timezone:"Europe/Brussels",currencyCode:"EUR",phone:"",email:"",website:"",addressLine1:"",addressLine2:"",postalCode:"",city:"",region:"" };
const countries = [{value:"BE",label:"Belgium"},{value:"NL",label:"Netherlands"},{value:"FR",label:"France"},{value:"DE",label:"Germany"},{value:"LU",label:"Luxembourg"},{value:"PT",label:"Portugal"}];
const languages = [{value:"en",label:"English"},{value:"fr",label:"French"},{value:"nl",label:"Dutch"},{value:"de",label:"German"},{value:"pt",label:"Portuguese"}];
const timezones = ["Europe/Brussels","Europe/Amsterdam","Europe/Paris","Europe/Berlin","Europe/Luxembourg","Europe/Lisbon"].map(value=>({value,label:value}));
const currencies = ["EUR","GBP","USD"].map(value=>({value,label:value}));

export function CompanyDetailsForm({ companyId, values = empty, canEdit = true }: { companyId?: string; values?: CompanyFormValues; canEdit?: boolean }) {
  const action = companyId ? updateCompanyAction.bind(null, companyId) : createCompanyAction;
  const [state, formAction] = useActionState(action, initialCompanyActionState);
  const error = (name: keyof CompanyFormValues) => state.fieldErrors?.[name];
  return <form action={formAction} className="space-y-6">
    <fieldset disabled={!canEdit} className="grid gap-5 sm:grid-cols-2 disabled:opacity-75">
      <Input name="displayName" label="Display name" defaultValue={values.displayName} error={error("displayName")} required maxLength={160}/>
      <Input name="legalName" label="Legal name" defaultValue={values.legalName} error={error("legalName")} required maxLength={160}/>
      <Input name="registrationNumber" label="Registration number" defaultValue={values.registrationNumber} error={error("registrationNumber")} maxLength={64}/>
      <Input name="vatNumber" label="VAT number" defaultValue={values.vatNumber} error={error("vatNumber")} hint="Structural validation only" maxLength={64}/>
      <Select name="countryCode" label="Country" defaultValue={values.countryCode} options={countries} error={error("countryCode")}/>
      <Select name="defaultLanguage" label="Default language" defaultValue={values.defaultLanguage} options={languages} error={error("defaultLanguage")}/>
      <Select name="timezone" label="Timezone" defaultValue={values.timezone} options={timezones} error={error("timezone")}/>
      <Select name="currencyCode" label="Currency" defaultValue={values.currencyCode} options={currencies} error={error("currencyCode")}/>
      <EmailInput name="email" label="Company email" defaultValue={values.email} error={error("email")}/>
      <PhoneInput name="phone" label="Phone" defaultValue={values.phone} error={error("phone")}/>
      <Input name="website" type="url" label="Website" defaultValue={values.website} error={error("website")} placeholder="https://"/>
      <Input name="city" label="City" defaultValue={values.city}/>
      {companyId ? <><Input name="addressLine1" label="Address line 1" defaultValue={values.addressLine1}/><Input name="addressLine2" label="Address line 2" defaultValue={values.addressLine2}/><Input name="postalCode" label="Postal code" defaultValue={values.postalCode}/><Input name="region" label="Region" defaultValue={values.region}/></> : null}
    </fieldset>
    <CompanyFormStatus state={state}/>
    {canEdit ? <div className="flex justify-end"><CompanySubmitButton label={companyId ? "Save company" : "Create company"} pendingLabel={companyId ? "Saving…" : "Creating…"}/></div> : <p className="text-sm text-[#9CA3AF]">Your role provides read-only access.</p>}
  </form>;
}
