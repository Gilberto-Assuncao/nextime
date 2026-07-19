type IconProps = {
  className?: string;
};

function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ApprovalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 3v3h6V3M8 13l2.5 2.5L16 10" />
    </svg>
  );
}

function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ReportsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </svg>
  );
}

function ExportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" />
      <path d="M3 10h12M11 6l4 4-4 4" />
    </svg>
  );
}

const features = [
  {
    title: "Time Tracking",
    description: "Registre cada hora com precisão e mantenha o foco no trabalho que realmente importa.",
    icon: ClockIcon,
  },
  {
    title: "Team Management",
    description: "Organize equipes, projetos e responsabilidades em um único espaço colaborativo.",
    icon: UsersIcon,
  },
  {
    title: "Timesheet Approval",
    description: "Revise e aprove folhas de horas com um fluxo simples, claro e confiável.",
    icon: ApprovalIcon,
  },
  {
    title: "Live Dashboard",
    description: "Acompanhe produtividade, capacidade e progresso com dados sempre atualizados.",
    icon: DashboardIcon,
  },
  {
    title: "Reports",
    description: "Transforme registros de tempo em relatórios úteis para decisões mais inteligentes.",
    icon: ReportsIcon,
  },
  {
    title: "Accounting Export",
    description: "Exporte dados consistentes e agilize o fechamento financeiro e contabilístico.",
    icon: ExportIcon,
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-border/70 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Tudo em um só lugar</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Tempo sob controle. Equipes em movimento.</h2>
          <p className="mt-5 leading-7 text-muted">Ferramentas essenciais para simplificar a rotina, ganhar visibilidade e transformar horas em resultados.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 sm:p-7">
              <div aria-hidden="true" className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/15" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-6 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
