import type { CompanyActionState } from "../types";

export function CompanyFormStatus({ state }: { state: CompanyActionState }) {
  if (!state.message) return null;
  return <p aria-live="polite" role={state.status === "error" ? "alert" : "status"} className={`rounded-xl border p-3 text-sm ${state.status === "error" ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-green-400/30 bg-green-400/10 text-green-100"}`}>{state.message}</p>;
}
