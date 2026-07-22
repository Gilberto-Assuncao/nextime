import type { Metadata } from "next"; import { WorkforceOverview, getWorkforceOverview } from "@/src/features/workforce";
export const metadata:Metadata={title:"Workforce"};
export default async function WorkforcePage(){const {members,teams}=await getWorkforceOverview();return <WorkforceOverview members={members} teams={teams}/>;}
