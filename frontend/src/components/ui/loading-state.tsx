export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-sm text-[var(--text-muted)]">
      <div className="animate-pulse">{label}</div>
    </div>
  );
}
