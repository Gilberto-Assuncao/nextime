import type { Metadata } from "next"; import { WorkforceOverview, demoWorkforceMembers, demoWorkforceTeams } from "@/src/features/workforce";
export const metadata:Metadata={title:"Workforce"};
export default function WorkforcePage(){return <WorkforceOverview members={demoWorkforceMembers} teams={demoWorkforceTeams}/>;}
