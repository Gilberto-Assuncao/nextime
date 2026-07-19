export default function Header() {
  return (
    <header className="h-[72px] w-full bg-transparent">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
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
          className="hidden items-center gap-8 text-sm font-medium text-muted md:flex"
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

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#"
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface sm:px-4"
          >
            Entrar
          </a>
          <a
            href="#"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-background-deep hover:bg-primary-hover sm:px-4"
          >
            Começar<span className="hidden sm:inline"> gratuitamente</span>
          </a>
        </div>
      </div>
    </header>
  );
}
