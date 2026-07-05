// Bridge between the axios refresh interceptor and the AuthProvider without a
// circular import. When a silent token refresh fails, axios calls
// `emitSessionExpired()`; the AuthProvider registers a handler that clears the
// user state and (best-effort) hits sign-out. Kept tiny and framework-free.

type SessionExpiredHandler = () => void;

let handler: SessionExpiredHandler | null = null;

export function onSessionExpired(next: SessionExpiredHandler): () => void {
  handler = next;
  return () => {
    if (handler === next) {
      handler = null;
    }
  };
}

export function emitSessionExpired(): void {
  if (handler) {
    handler();
  }
}
