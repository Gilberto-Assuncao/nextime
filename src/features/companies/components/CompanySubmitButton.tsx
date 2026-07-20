"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/src/components/ui";
export function CompanySubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) { const { pending } = useFormStatus(); return <Button type="submit" loading={pending}>{pending ? pendingLabel : label}</Button>; }
