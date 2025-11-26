"use client";

import { useMemo, useEffect, useCallback, type ReactNode } from "react";

import { useSetState } from "src/hooks/use-set-state";

import axios, { endpoints } from "src/utils/axios";

import { STORAGE_KEY } from "./constant";
import { AuthContext, type AuthContextValue } from "../auth-context";
import { setSession, isValidToken } from "./utils";

import type { User } from "src/types/domain";

// ----------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthState extends Record<string, unknown> {
  user: (User & { accessToken?: string; role?: string }) | null;
  loading: boolean;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axios.get<{ user: User }>(endpoints.auth.me);

        const { user } = res.data;

        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo<AuthContextValue>(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? "admin",
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
