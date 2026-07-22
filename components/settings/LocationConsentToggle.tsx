"use client";

import { useState } from "react";
import { Switch } from "@/src/components/forms";
import { updateLocationConsentAction } from "@/src/features/account/actions";

export default function LocationConsentToggle({ initialConsent }: { initialConsent: boolean }) {
  const [consent, setConsent] = useState(initialConsent);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function onChange(next: boolean) {
    setConsent(next);
    setPending(true);
    const result = await updateLocationConsentAction(next);
    setMessage(result.message);
    setPending(false);
  }

  return (
    <section aria-labelledby="location-consent-title" className="rounded-2xl border border-white/10 bg-[#161A34] p-5 sm:p-6">
      <h2 id="location-consent-title" className="text-lg font-semibold text-[#E5E7EB]">Location sharing</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-[#9CA3AF]">
        When enabled, your device&apos;s location is captured the moment you stop the Time Tracking timer, so your manager can see where your team is working on the Live Map. This is off by default and only applies while a timer session is active — manual time entries never capture location.
      </p>
      <div className="mt-4">
        <Switch label={consent ? "Sharing my location when I clock in" : "Not sharing my location"} checked={consent} onChange={onChange} disabled={pending} />
      </div>
      {message ? <p aria-live="polite" className="mt-2 text-sm text-[#4ADE80]">{message}</p> : null}
    </section>
  );
}
