import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import AcceptInviteForm from "@/components/auth/AcceptInviteForm";

export const metadata: Metadata = { title: "Accept invitation" };

export default function AcceptInvitePage() {
  return <AuthLayout><AcceptInviteForm /></AuthLayout>;
}
