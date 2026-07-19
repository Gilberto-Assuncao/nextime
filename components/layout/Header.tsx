export default function Header() {
  return (
    <header className="relative z-50 h-[72px] w-full bg-transparent">
      <div className="relative mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#" className="flex shrink-0 flex-col leading-none">
          <span className="text-xl font-bold tracking-[0.16em] text-foreground">
            NEXTIME
          </span>
          <span className="mt-1 hidden text-[0.6rem] font-medium tracking-[0.2em] text-muted sm:block">
            TIME WELL MANAGED.
          </span>
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 text-sm font-medium text-muted lg:flex"
        >
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#companies" className="hover:text-foreground">
            Companies
          </a>
          <a href="#employees" className="hover:text-foreground">
            Employees
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#"
            className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Entrar
          </a>
          <a
            href="#"
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background-deep transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Começar<span className="hidden sm:inline"> gratuitamente</span>
          </a>
        </div>

        <details className="group lg:hidden">
          <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-border text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Abrir navegação</span>
            <span aria-hidden="true" className="relative h-4 w-5">
              <span className="absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform group-open:translate-y-[7px] group-open:rotate-45" />
              <span className="absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity group-open:opacity-0" />
              <span className="absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform group-open:-translate-y-[7px] group-open:-rotate-45" />
            </span>
          </summary>

          <div className="absolute left-5 right-5 top-[64px] overflow-hidden rounded-2xl border border-border bg-surface p-3 shadow-2xl shadow-black/40 sm:left-auto sm:right-8 sm:w-80">
            <nav aria-label="Navegação móvel">
              <ul className="grid">
                <li><a href="#features" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-background-deep hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">Features</a></li>
                <li><a href="#companies" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-background-deep hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">Companies</a></li>
                <li><a href="#employees" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-background-deep hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">Employees</a></li>
                <li><a href="#faq" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-background-deep hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">FAQ</a></li>
              </ul>
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <a href="#" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-3 text-sm font-semibold text-foreground transition-colors hover:bg-background-deep focus-visible:outline-2 focus-visible:outline-primary">Entrar</a>
              <a href="#" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-background-deep transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-primary">Começar</a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
