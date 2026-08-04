"use client";

import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import { fRub, fRubShort } from "src/sections/finance/utils";
import {
  useMemo,
  useState,
  useContext,
  useCallback,
  createContext,
} from "react";

interface FinancePrivacy {
  hidden: boolean;
  toggle: () => void;
}

const FinancePrivacyContext = createContext<FinancePrivacy>({
  hidden: true,
  toggle: () => {},
});

// Страница всегда открывается со скрытыми суммами, и выбор не запоминается:
// «показал» живёт до перезагрузки, чтобы дашборд нельзя было случайно
// оставить раскрытым на общем экране.
export function FinancePrivacyProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(true);
  const toggle = useCallback(() => setHidden((prev) => !prev), []);
  const value = useMemo(() => ({ hidden, toggle }), [hidden, toggle]);

  return (
    <FinancePrivacyContext.Provider value={value}>
      {children}
    </FinancePrivacyContext.Provider>
  );
}

export function useFinancePrivacy(): FinancePrivacy {
  return useContext(FinancePrivacyContext);
}

export function Amount({ value, short }: { value: number; short?: boolean }) {
  const { hidden } = useFinancePrivacy();

  if (hidden) {
    return (
      <Box
        component="span"
        aria-label="сумма скрыта"
        sx={{ letterSpacing: 1.5, userSelect: "none" }}
      >
        ••••••
      </Box>
    );
  }

  return <>{short ? fRubShort(value) : fRub(value)}</>;
}
