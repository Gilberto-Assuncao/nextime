import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyOverview, getCompanyDetail } from "@/src/features/companies";

export const metadata: Metadata = { title: "Active company" };
export default async function ActiveCompanyPage() { const company=await getCompanyDetail(); if(!company) notFound(); return <CompanyOverview company={company}/>; }
