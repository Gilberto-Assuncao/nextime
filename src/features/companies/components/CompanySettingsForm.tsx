"use client";
import { useActionState, useState } from "react";
import { Input, Select, Switch } from "@/src/components/forms";
import { updateCompanySettingsAction } from "../actions";
import { initialCompanyActionState, type CompanySettingsValues } from "../types";
import { CompanyFormStatus } from "./CompanyFormStatus";
import { CompanySubmitButton } from "./CompanySubmitButton";

export function CompanySettingsForm({ companyId, values, canEdit }: { companyId: string; values: CompanySettingsValues; canEdit: boolean }) {
  const [state, action] = useActionState(updateCompanySettingsAction.bind(null, companyId), initialCompanyActionState);
  const error = (name: keyof CompanySettingsValues) => state.fieldErrors?.[name];
  const [remindersEnabled, setRemindersEnabled] = useState(values.punctualityRemindersEnabled);
  return <form action={action} className="space-y-6"><fieldset disabled={!canEdit} className="grid gap-5 sm:grid-cols-2 disabled:opacity-75">
    <Select name="defaultLanguage" label="Default language" defaultValue={values.defaultLanguage} error={error("defaultLanguage")} options={[{value:"en",label:"English"},{value:"fr",label:"French"},{value:"nl",label:"Dutch"},{value:"de",label:"German"},{value:"pt",label:"Portuguese"}]}/>
    <Select name="timezone" label="Timezone" defaultValue={values.timezone} error={error("timezone")} options={["Europe/Brussels","Europe/Amsterdam","Europe/Paris","Europe/Berlin","Europe/Lisbon"].map(value=>({value,label:value}))}/>
    <Select name="currencyCode" label="Currency" defaultValue={values.currencyCode} error={error("currencyCode")} options={["EUR","GBP","USD"].map(value=>({value,label:value}))}/>
    <Select name="dateFormat" label="Date format" defaultValue={values.dateFormat} error={error("dateFormat")} options={["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"].map(value=>({value,label:value}))}/>
    <Select name="timeFormat" label="Time format" defaultValue={values.timeFormat} error={error("timeFormat")} options={[{value:"24h",label:"24-hour"},{value:"12h",label:"12-hour"}]}/>
    <Select name="weekStartsOn" label="First day of week" defaultValue={values.weekStartsOn} error={error("weekStartsOn")} options={[{value:"1",label:"Monday"},{value:"0",label:"Sunday"},{value:"6",label:"Saturday"}]}/>
    <Select name="status" label="Operational status" defaultValue={values.status === "archived" ? "inactive" : values.status} error={error("status")} options={[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"suspended",label:"Suspended"}]}/>
  </fieldset>
  <fieldset disabled={!canEdit} className="grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2 disabled:opacity-75">
    <div className="sm:col-span-2"><h3 className="text-sm font-semibold text-[#E5E7EB]">Punctuality reminders</h3><p className="mt-1 text-xs text-[#9CA3AF]">Notify a team member if they haven&apos;t clocked in by the expected start time plus the grace period.</p></div>
    <Input name="expectedStartTime" type="time" label="Expected start time" defaultValue={values.expectedStartTime} error={error("expectedStartTime")}/>
    <Input name="expectedEndTime" type="time" label="Expected end time" defaultValue={values.expectedEndTime} error={error("expectedEndTime")}/>
    <Input name="graceMinutes" type="number" min="0" max="180" label="Grace period (minutes)" defaultValue={values.graceMinutes} error={error("graceMinutes")}/>
    <div className="flex items-end"><input type="hidden" name="punctualityRemindersEnabled" value={remindersEnabled ? "on" : "off"}/><Switch label="Send punctuality reminders" checked={remindersEnabled} onChange={setRemindersEnabled}/></div>
  </fieldset>
  <CompanyFormStatus state={state}/>{canEdit?<div className="flex justify-end"><CompanySubmitButton label="Save settings" pendingLabel="Saving…"/></div>:<p className="text-sm text-[#9CA3AF]">Settings are read-only for your role.</p>}</form>;
}
