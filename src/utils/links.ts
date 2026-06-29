export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidUrl(url: string): boolean {
  const normalized = normalizeUrl(url);
  if (!normalized) return false;

  try {
    const parsed = new URL(normalized);
    return Boolean(parsed.protocol && parsed.hostname);
  } catch {
    return false;
  }
}

export function isIntercomUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;

  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname.includes("app.intercom.com") || parsed.hostname.includes("intercom.com");
  } catch {
    return false;
  }
}

export function openExternalUrl(url: string): void {
  const normalized = normalizeUrl(url);
  if (!isValidUrl(normalized)) return;
  window.open(normalized, "_blank", "noopener,noreferrer");
}
