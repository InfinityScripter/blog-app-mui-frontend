"use client";

import type { User } from "src/types/domain";

import { createContext } from "react";

// ----------------------------------------------------------------------

export interface AuthContextValue {
  user: (User & { accessToken?: string; role?: string }) | null;
  checkUserSession: () => Promise<void>;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthConsumer = AuthContext.Consumer;
