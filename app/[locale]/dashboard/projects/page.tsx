import type { Metadata } from "next"; import Link from "next/link"; import { getTranslations } from "next-intl/server"; import PageHeader from "@/components/dashboard/PageHeader"; import ProjectsTable from "@/components/projects/ProjectsTable"; import { getProjects } from "@/src/features/projects/data";
export const metadata: Metadata = { title: "Projects" };
export default async function ProjectsPage() {
  const [{ projects, clients }, t] = await Promise.all([getProjects(), getTranslations("projects")]);
  return <section aria-labelledby="projects-heading"><PageHeader headingId="projects-heading" eyebrow={t("eyebrow")} title={t("title")} description={t("countDescription", { projects: projects.length, clients: clients.length })} actions={<Link href="/dashboard/projects/new" className="flex min-h-11 items-center justify-center rounded-lg bg-[#22C55E] px-5 text-sm font-semibold text-[#07110B] hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">{t("addProject")}</Link>}/><ProjectsTable projects={projects} clients={clients}/></section>;
}
