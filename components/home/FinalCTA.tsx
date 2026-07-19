export default function FinalCTA() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-primary/30 bg-surface px-6 py-14 text-center shadow-2xl shadow-primary/10 sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-48 w-48 translate-x-1/3 translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Time well managed
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Make every hour work better.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted">
            Bring time, teams, and projects together in one clear workspace
            built for productive days and smarter decisions.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/register"
              className="inline-flex justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-background-deep transition-colors hover:bg-primary-hover"
            >
              Start Free
            </a>
            <a
              href="#companies"
              className="inline-flex justify-center rounded-lg border border-border bg-background-deep/60 px-6 py-3 font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-background-deep"
            >
              Request Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
