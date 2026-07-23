export type RosterRoleKey = "manager" | "accountant" | "hr" | "finance";

export type RosterMember = {
  membershipId: string;
  name: string;
  email: string;
  avatarInitials: string;
  roles: RosterRoleKey[];
};
