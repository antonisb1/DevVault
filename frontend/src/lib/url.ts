export function normalizeUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return '';

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}