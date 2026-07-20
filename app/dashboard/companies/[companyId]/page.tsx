import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyOverview, getCompanyDetail } from "@/src/features/companies";
export const metadata: Metadata={title:"Company"};
export default async function CompanyPage({params}:{params:Promise<{companyId:string}>}){const {companyId}=await params;const company=await getCompanyDetail(companyId);if(!company)notFound();return <CompanyOverview company={company}/>;}
