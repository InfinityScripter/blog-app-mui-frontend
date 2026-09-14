/**
 * Restricts post-login redirects to in-app relative paths.
 * `GuestGuard` used to pass `?returnTo=` straight into `router.replace`, which
 * accepts protocol-relative (`//evil`) and absolute URLs — open redirect.
 */
export function safeReturnTo(
  candidate: string | null | undefined,
  fallback: string,
): string {
  if (!candidate) return fallback;
  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("://") ||
    candidate.includes("\\")
  ) {
    return fallback;
  }
  return candidate;
}
