import { SectionCard } from './section-card';

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <SectionCard className="h-full">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      {hint ? <p className="mt-2 text-xs text-[var(--text-muted)]">{hint}</p> : null}
    </SectionCard>
  );
}
