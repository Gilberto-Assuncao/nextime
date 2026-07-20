import { Badge } from "@/src/components/data-display"; import type { CompanyRole, WorkforceMembershipStatus } from "@/src/domain";
export function MemberStatusBadge({ status }: { status:WorkforceMembershipStatus }) { const tone=status==="active"?"success":status==="invited"?"info":status==="suspended"?"warning":"neutral"; return <Badge tone={tone}><span aria-hidden="true">●</span> {status}</Badge>; }
export function RoleBadge({ role }: { role:CompanyRole }) { return <Badge tone={role==="owner"||role==="admin"?"info":"neutral"}>{role}</Badge>; }
