// Bridge between the axios refresh interceptor and the AuthProvider without a
// circular import. When a silent token refresh fails, axios calls
// `emitSessionExpired()`; each mounted AuthProvider registers a handler that
// clears its user state. Kept tiny and framework-free.
//
// A Set (not a single ref) so every subscribed AuthProvider is notified — not
// just the last to subscribe. The app mounts a single AuthProvider in
// `[locale]/layout.tsx`; the Set stays correct if that ever changes.

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
