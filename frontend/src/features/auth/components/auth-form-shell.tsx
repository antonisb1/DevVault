import type { PropsWithChildren } from 'react';

export function AuthFormShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="hidden rounded-[2rem] bg-linear-to-br from-indigo-600 via-violet-600 to-sky-500 p-10 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">DevVault</p>
          <h1 className="mt-6 text-5xl font-bold leading-tight">Build a job-ready developer operating system.</h1>
          <p className="mt-6 max-w-lg text-base text-white/85">
            Manage job applications, learning resources, project execution, personal notes, bookmarks, and recurring developer costs in one polished workspace.
          </p>
        </div>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">Get started</p>
          <h2 className="mt-3 text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
