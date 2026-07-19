const navigation = [
  { label: "Features", href: "#features" },
  { label: "Companies", href: "#companies" },
  { label: "Employees", href: "#employees" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <a href="#" className="flex w-fit flex-col leading-none">
            <span className="text-xl font-bold tracking-[0.16em] text-foreground">
              NEXTIME
            </span>
            <span className="mt-2 text-[0.6rem] font-medium tracking-[0.2em] text-muted">
              TIME WELL MANAGED.
            </span>
          </a>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted">
              {navigation.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="inline-flex min-h-11 items-center transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-border/60 pt-6 text-sm text-muted">
          © {currentYear} NEXTIME. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
