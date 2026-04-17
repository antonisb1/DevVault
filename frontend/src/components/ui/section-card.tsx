import type { PropsWithChildren, ReactNode } from 'react';

import { cn } from '../../lib/cn';

export function SectionCard({ title, subtitle, action, className, children }: PropsWithChildren<{ title?: string; subtitle?: string; action?: ReactNode; className?: string }>) {
  return (
    <section className={cn('rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm', className)}>
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
