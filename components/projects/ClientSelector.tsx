"use client";

import { useTranslations } from "next-intl";
import type { Client } from "@/lib/types/project";
export default function ClientSelector({ clients, className, defaultValue = "" }: { clients: Client[]; className: string; defaultValue?: string }) { const t = useTranslations("projects"); return <select id="client" name="clientId" required defaultValue={defaultValue} className={className}><option value="" disabled>{t("selectClient")}</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}</select>; }
