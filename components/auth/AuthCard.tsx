"use client";

import type { FormEvent, ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({ title, description, children, footer }: AuthCardProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-[#161A34] p-5 shadow-2xl shadow-black/30 sm:p-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">{description}</p>
      </header>
      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {children}
      </form>
      {footer ? <div className="mt-6 text-center text-sm text-[#9CA3AF]">{footer}</div> : null}
    </section>
  );
}
