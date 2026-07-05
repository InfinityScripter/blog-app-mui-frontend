"use client";

import type { User } from "src/types/domain";

import axios, { endpoints } from "src/utils/axios";
import { useSetState } from "src/hooks/use-set-state";
import { useMemo, useEffect, useCallback, type ReactNode } from "react";

import { onSessionExpired } from "./session-events";
import { AuthContext, type AuthContextValue } from "../auth-context";

// ----------------------------------------------------------------------
// Cookie-based session. The token lives in an httpOnly cookie the browser
// sends automatically, so the client can't read it — "is there a session" is
// answered by whether GET /me succeeds. Expired access tokens are refreshed
// transparently by the axios interceptor; only a failed refresh surfaces here
// (via onSessionExpired) and clears the user.

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthState extends Record<string, unknown> {
  user: (User & { role?: string }) | null;
  loading: boolean;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const res = await axios.get<{ user: User }>(endpoints.auth.me);
      setState({ user: res.data.user, loading: false });
    } catch {
      // /me failed even after the interceptor's refresh attempt → no session.
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A failed silent refresh (from the axios interceptor) ends the session.
  useEffect(
    () => onSessionExpired(() => setState({ user: null, loading: false })),
    [setState],
  );

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo<AuthContextValue>(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'user',
          }
        : null,
      checkUserSession,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
    }),
    [checkUserSession, state.user, status],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
