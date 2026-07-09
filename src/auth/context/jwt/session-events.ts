// Bridge between the axios refresh interceptor and the AuthProvider without a
// circular import. When a silent token refresh fails, axios calls
// `emitSessionExpired()`; each mounted AuthProvider registers a handler that
// clears its user state. Kept tiny and framework-free.
//
// A Set (not a single ref) so this stays correct when more than one AuthProvider
// is mounted — this app nests a second AuthProvider under several route-group
// layouts, and every instance must be notified, not just the last to subscribe.

type SessionExpiredHandler = () => void;

const handlers = new Set<SessionExpiredHandler>();

export function onSessionExpired(next: SessionExpiredHandler): () => void {
  handlers.add(next);
  return () => {
    handlers.delete(next);
  };
}

export function emitSessionExpired(): void {
  // Isolate each handler: one throwing subscriber must not stop the rest of
  // the mounted AuthProviders from being signed out.
  handlers.forEach((handler) => {
    try {
      handler();
    } catch (error) {
      console.error("session-expired handler failed:", error);
    }
  });
}
