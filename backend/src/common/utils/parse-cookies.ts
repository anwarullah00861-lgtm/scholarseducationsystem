/**
 * Minimal parser for the unsigned `Cookie` request header.
 *
 * Replaces cookie-parser@1.4.7, which deadlocks every request when combined
 * with the Express 5 runtime shipped by Nest 11. Only the plain
 * `name=value; name2=value2` subset the API relies on is supported.
 */
export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};

  for (const part of (cookieHeader ?? '').split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const name = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (!name) {
      continue;
    }

    try {
      cookies[name] = decodeURIComponent(value);
    } catch {
      cookies[name] = value;
    }
  }

  return cookies;
}
