import Header from "@/components/layout/Header";
import Companies from "@/components/home/Companies";
import Employees from "@/components/home/Employees";
import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="mx-auto grid max-w-[1280px] gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:py-32">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Time well managed
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Controle seu tempo.
            <br />
            Organize seu trabalho.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Registre horas, acompanhe projetos e gerencie equipes em uma
            plataforma moderna para profissionais e empresas.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-background-deep hover:bg-primary-hover"
            >
              Começar gratuitamente
            </a>
            <a
              href="#"
              className="inline-flex justify-center rounded-lg border border-border px-6 py-3 font-semibold text-foreground hover:bg-surface"
            >
              Ver demonstração
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="border-b border-border pb-6">
            <p className="text-sm text-muted">Horas esta semana</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">38h 45min</p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background-deep p-5 sm:col-span-2">
              <dt className="text-sm text-muted">Projeto atual</dt>
              <dd className="mt-2 text-lg font-semibold">
                Residencial Bruxelas
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-background-deep p-5">
              <dt className="text-sm text-muted">Entrada</dt>
              <dd className="mt-2 text-2xl font-bold">07:15</dd>
            </div>
            <div className="rounded-xl border border-border bg-background-deep p-5">
              <dt className="text-sm text-muted">Status</dt>
              <dd className="mt-2 flex items-center gap-2 font-semibold text-primary">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-primary"
                />
                Em andamento
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Features />
      <Companies />
      <Employees />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
