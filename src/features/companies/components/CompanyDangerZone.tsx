"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui";
import { ConfirmationDialog } from "@/src/components/feedback";
import { setCompanyArchivedAction } from "../actions";
import type { ManagedCompanyStatus } from "../types";

export function CompanyDangerZone({ companyId, status, canArchive, canReactivate }: { companyId:string; status:ManagedCompanyStatus; canArchive:boolean; canReactivate:boolean }) {
  const router=useRouter(); const [open,setOpen]=useState(false); const [pending,startTransition]=useTransition(); const [message,setMessage]=useState("");
  const archived=status==="archived";
  function confirm(){startTransition(async()=>{const result=await setCompanyArchivedAction(companyId,!archived);setMessage(result.message);setOpen(false);if(result.ok){if(archived)router.refresh();else router.push("/dashboard/companies");}});}
  if ((!archived&&!canArchive)||(archived&&!canReactivate)) return null;
  return <section className="rounded-2xl border border-red-400/30 bg-red-400/5 p-5"><h2 className="text-lg font-semibold text-red-100">Company danger zone</h2><p className="mt-2 text-sm text-[#D1D5DB]">{archived?"Reactivate this company and return it to normal operation.":"Archive this company without deleting its records, memberships, or history."}</p><div className="mt-4"><Button variant={archived?"outline":"danger"} loading={pending} onClick={()=>setOpen(true)}>{archived?"Reactivate company":"Archive company"}</Button></div>{message?<p aria-live="polite" className="mt-3 text-sm text-[#D1D5DB]">{message}</p>:null}<ConfirmationDialog open={open} title={archived?"Reactivate company?":"Archive company?"} description={archived?"The company will become available in the Company Switcher again.":"The company will be removed from normal operation and the Company Switcher. All historical data will be preserved."} confirmLabel={archived?"Reactivate":"Archive company"} onConfirm={confirm} onClose={()=>setOpen(false)}/></section>;
}
