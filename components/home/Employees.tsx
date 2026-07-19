const benefits = [
  "Registos rápidos e uma visão clara de cada dia de trabalho",
  "Organização pessoal sem folhas de cálculo ou processos complicados",
  "Histórico completo para acompanhar foco, ritmo e evolução",
];

export default function Employees() {
  return (
    <section id="employees" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-1">
          <div className="rounded-2xl border border-border bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 sm:col-span-2">
            <p className="text-sm text-muted">Hoje</p>
            <p className="mt-2 text-3xl font-bold">7h 32min</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-background-deep"><div className="h-full w-4/5 rounded-full bg-primary" /></div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 transition-transform duration-300 hover:-translate-y-1">
            <p className="text-sm text-muted">Foco semanal</p>
            <p className="mt-2 text-2xl font-bold">92%</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 transition-transform duration-300 hover:-translate-y-1">
            <p className="text-sm text-primary">Meta</p>
            <p className="mt-2 text-2xl font-bold">Quase lá</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">For Employees</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Uma rotina mais leve começa com o seu tempo.</h2>
          <p className="mt-5 leading-7 text-muted">Registe o trabalho sem interromper o fluxo e tenha uma visão simples do que realizou, todos os dias.</p>
          <ul className="mt-7 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-foreground/90">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                {benefit}
              </li>
            ))}
          </ul>
          <a href="/register" className="mt-8 inline-flex rounded-lg border border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-background-deep">Start Free</a>
        </div>
      </div>
    </section>
  );
}
