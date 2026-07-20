export type TeamStatus="active"|"inactive"|"archived";
export type TeamRole="leader"|"supervisor"|"member";
export type TeamPermission="view"|"manage"|"archive";
export interface TeamMember { id:string; membershipId:string; name:string; email:string; jobTitle:string; role:TeamRole; joinedAt:string; }
export interface AvailableMember { membershipId:string; name:string; email:string; jobTitle:string; }
export interface TeamSummary { id:string; name:string; description:string; status:TeamStatus; color:string; icon:string; leaderName:string|null; memberCount:number; updatedAt:string; }
export interface TeamDetails extends TeamSummary { companyId:string; companyName:string; leaderMembershipId:string|null; createdAt:string; permissions:TeamPermission[]; members:TeamMember[]; availableMembers:AvailableMember[]; }
export interface TeamFormValues { name:string; description:string; status:TeamStatus; color:string; icon:string; leaderMembershipId:string; memberIds:string[]; }
export interface TeamActionState { status:"idle"|"success"|"error"; message?:string; fieldErrors?:Partial<Record<"name"|"description"|"status"|"color"|"leaderMembershipId"|"memberIds",string>>; }
export const initialTeamActionState:TeamActionState={status:"idle"};
