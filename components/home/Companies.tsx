const benefits = [
  "Visibilidade em tempo real sobre projetos e capacidade da equipe",
  "Aprovações de horas mais rápidas e processos administrativos simples",
  "Dados consistentes para planeamento, faturação e contabilidade",
];

export default function Companies() {
  return (
    <section id="companies" className="px-5 py-10 sm:px-8 sm:py-14">
      <div className="relative mx-auto grid max-w-[1280px] overflow-hidden rounded-3xl border border-border bg-surface px-6 py-12 shadow-2xl shadow-black/20 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16 lg:py-16">
        <div aria-hidden="true" className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">For Companies</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Mais clareza para gerir. Mais tempo para crescer.</h2>
          <p className="mt-5 leading-7 text-muted">Centralize o controlo de horas e transforme a operação diária numa fonte confiável de informação para toda a empresa.</p>
          <a href="#" className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-background-deep transition-colors hover:bg-primary-hover">Request Demo</a>
        </div>

        <ul className="relative mt-10 grid content-center gap-4 lg:mt-0">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-4 rounded-xl border border-border bg-background-deep/70 p-4 transition-colors hover:border-primary/40">
              <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">✓</span>
              <span className="text-sm leading-6 text-foreground/90">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
