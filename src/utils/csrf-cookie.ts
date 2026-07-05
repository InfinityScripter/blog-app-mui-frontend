// Reads the non-httpOnly CSRF cookie the backend sets on login/refresh, so the
// SPA can echo it back in the X-CSRF-Token header (double-submit CSRF). The
// access/refresh cookies are httpOnly and intentionally NOT readable here.

export const CSRF_COOKIE_NAME = "csrf_token";

const MUTATING_METHODS = ["post", "put", "patch", "delete"];

/** Read a cookie value by name from document.cookie (browser only). */
export function readBrowserCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const prefix = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : undefined;
}

/** True for HTTP methods that change state and therefore need a CSRF token. */
export function isMutatingMethod(method: string | undefined): boolean {
  return MUTATING_METHODS.includes((method ?? "get").toLowerCase());
}
