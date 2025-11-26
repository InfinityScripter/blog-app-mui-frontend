"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";

import { paths } from "src/routes/paths";
import { useRouter, usePathname, useSearchParams } from "src/routes/hooks";

import { CONFIG } from "src/config-global";

import { SplashScreen } from "src/components/loading-screen";

import { useAuthContext } from "../hooks";

// ----------------------------------------------------------------------

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (!authenticated) {
          const { method } = CONFIG.auth;

          const signInPathMap: Record<string, string> = {
            jwt: paths.auth.jwt.signIn,
            amplify: paths.auth.jwt.signIn, // Add other methods as needed
            firebase: paths.auth.jwt.signIn,
            supabase: paths.auth.jwt.signIn,
            auth0: paths.auth.jwt.signIn,
          };

          const signInPath = signInPathMap[method] || paths.auth.jwt.signIn;

      const href = `${signInPath}?${createQueryString("returnTo", pathname ?? "")}`;

      router.replace(href);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
