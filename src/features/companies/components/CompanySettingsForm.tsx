"use client";
import { useActionState } from "react";
import { Select } from "@/src/components/forms";
import { updateCompanySettingsAction } from "../actions";
import { initialCompanyActionState, type CompanySettingsValues } from "../types";
import { CompanyFormStatus } from "./CompanyFormStatus";
import { CompanySubmitButton } from "./CompanySubmitButton";

export function CompanySettingsForm({ companyId, values, canEdit }: { companyId: string; values: CompanySettingsValues; canEdit: boolean }) {
  const [state, action] = useActionState(updateCompanySettingsAction.bind(null, companyId), initialCompanyActionState);
  const error = (name: keyof CompanySettingsValues) => state.fieldErrors?.[name];
  return <form action={action} className="space-y-6"><fieldset disabled={!canEdit} className="grid gap-5 sm:grid-cols-2 disabled:opacity-75">
    <Select name="defaultLanguage" label="Default language" defaultValue={values.defaultLanguage} error={error("defaultLanguage")} options={[{value:"en",label:"English"},{value:"fr",label:"French"},{value:"nl",label:"Dutch"},{value:"de",label:"German"},{value:"pt",label:"Portuguese"}]}/>
    <Select name="timezone" label="Timezone" defaultValue={values.timezone} error={error("timezone")} options={["Europe/Brussels","Europe/Amsterdam","Europe/Paris","Europe/Berlin","Europe/Lisbon"].map(value=>({value,label:value}))}/>
    <Select name="currencyCode" label="Currency" defaultValue={values.currencyCode} error={error("currencyCode")} options={["EUR","GBP","USD"].map(value=>({value,label:value}))}/>
    <Select name="dateFormat" label="Date format" defaultValue={values.dateFormat} error={error("dateFormat")} options={["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"].map(value=>({value,label:value}))}/>
    <Select name="timeFormat" label="Time format" defaultValue={values.timeFormat} error={error("timeFormat")} options={[{value:"24h",label:"24-hour"},{value:"12h",label:"12-hour"}]}/>
    <Select name="weekStartsOn" label="First day of week" defaultValue={values.weekStartsOn} error={error("weekStartsOn")} options={[{value:"1",label:"Monday"},{value:"0",label:"Sunday"},{value:"6",label:"Saturday"}]}/>
    <Select name="status" label="Operational status" defaultValue={values.status === "archived" ? "inactive" : values.status} error={error("status")} options={[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"suspended",label:"Suspended"}]}/>
  </fieldset><CompanyFormStatus state={state}/>{canEdit?<div className="flex justify-end"><CompanySubmitButton label="Save settings" pendingLabel="Saving…"/></div>:<p className="text-sm text-[#9CA3AF]">Settings are read-only for your role.</p>}</form>;
}
