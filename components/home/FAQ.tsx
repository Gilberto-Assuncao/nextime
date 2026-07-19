const questions = [
  {
    question: "What is NEXTIME?",
    answer:
      "NEXTIME is a modern time management platform for tracking hours, organizing projects, and managing teams in one place.",
  },
  {
    question: "Is NEXTIME suitable for construction companies?",
    answer:
      "Yes. NEXTIME helps construction companies track hours across sites, projects, and teams with clear, reliable records.",
  },
  {
    question: "Can employees use NEXTIME individually?",
    answer:
      "Yes. Employees and independent professionals can use NEXTIME to organize their work and understand how they spend their time.",
  },
  {
    question: "Can I export worked hours?",
    answer:
      "Yes. Worked hours can be exported for reporting, invoicing, payroll, and accounting workflows.",
  },
  {
    question: "Does NEXTIME support multiple teams?",
    answer:
      "Yes. Companies can organize multiple teams, assign projects, and maintain visibility across the whole operation.",
  },
  {
    question: "Will NEXTIME be available on mobile devices?",
    answer:
      "Yes. Mobile access is part of the NEXTIME roadmap so teams can manage time wherever work happens.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="border-t border-border/70 px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to know.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-muted">
            Clear answers about how NEXTIME helps professionals and companies
            manage their time.
          </p>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group px-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-semibold outline-none transition-colors hover:text-primary focus-visible:text-primary [&::-webkit-details-marker]:hidden">
                {question}
                <span
                  aria-hidden="true"
                  className="text-xl font-normal text-primary transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-5 pr-10 text-sm leading-6 text-muted transition-opacity duration-300 group-open:opacity-100">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
