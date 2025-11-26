"use client";

import { useContext } from "react";

import { AuthContext } from "../context/auth-context";

import type { AuthContextValue } from "../context/auth-context";

// ----------------------------------------------------------------------

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext: Context must be used inside AuthProvider");
  }

  return context;
}
