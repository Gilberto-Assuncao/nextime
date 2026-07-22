import type { Metadata } from "next"; import Link from "next/link"; import { getTranslations } from "next-intl/server"; import PageHeader from "@/components/dashboard/PageHeader"; import ProjectForm from "@/components/projects/ProjectForm"; import { getProjects } from "@/src/features/projects/data";
export const metadata: Metadata = { title: "New Project" };
export default async function NewProjectPage() {
  const [{ clients }, t] = await Promise.all([getProjects(), getTranslations("projects")]);
  return <section aria-labelledby="new-project-heading" className="mx-auto max-w-4xl"><Link href="/dashboard/projects" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#9CA3AF] hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E]">← {t("backToProjects")}</Link><div className="mb-6 mt-3"><PageHeader headingId="new-project-heading" title={t("newProjectTitle")} description={t("newProjectDescription")}/></div><ProjectForm clients={clients}/></section>;
}
