export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              NEXT<span className="text-emerald-400">IME</span>
            </h1>
            <p className="text-sm text-slate-400">
              Smart Time Management
            </p>
          </div>

          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400">
            Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          <div>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              SaaS para Controle de Horas
            </span>

            <h2 className="mt-8 text-5xl font-bold leading-tight">
              Controle de horas
              <br />
              <span className="text-emerald-400">
                simples, rápido e inteligente.
              </span>
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
              Desenvolvido para empresas de construção, manutenção,
              eletricistas, instaladores e equipes de campo.
            </p>

            <div className="mt-10 flex gap-4">
              <button className="rounded-xl bg-emerald-500 px-6 py-4 font-semibold text-black transition hover:bg-emerald-400">
                Começar gratuitamente
              </button>

              <button className="rounded-xl border border-slate-700 px-6 py-4 transition hover:bg-slate-800">
                Ver demonstração
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Horas desta semana
                </p>

                <h3 className="text-5xl font-bold">
                  38h
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-500/10 px-5 py-3 text-emerald-400">
                +12%
              </div>
            </div>

            <div className="space-y-4">

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Projeto Atual
                </p>

                <h4 className="mt-2 text-xl font-semibold">
                  Instalação Elétrica
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Entrada
                </p>

                <h4 className="mt-2 text-3xl font-bold">
                  07:32
                </h4>
              </div>

              <button className="mt-2 w-full rounded-2xl bg-red-500 py-4 text-lg font-semibold transition hover:bg-red-400">
                Encerrar Jornada
              </button>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}