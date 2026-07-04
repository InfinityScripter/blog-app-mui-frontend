"use client";

import { paths } from "src/routes/paths";
import { SplashScreen } from "src/components/loading-screen";
import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "src/routes/hooks";

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
      const signInPath = paths.auth.jwt.signIn;

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
