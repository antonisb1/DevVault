export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="text-3xl">✦</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
