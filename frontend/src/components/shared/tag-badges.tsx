export function TagBadges({ tags }: { tags: string[] }) {
  if (!tags.length) return <span className="text-xs text-[var(--text-muted)]">No tags</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--brand)]">
          {tag}
        </span>
      ))}
    </div>
  );
}
