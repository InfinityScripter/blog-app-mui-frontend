"use client";

import { useCookies } from "src/hooks/use-cookies";
import { useLocalStorage } from "src/hooks/use-local-storage";
import { useMemo, useState, useCallback, createContext } from "react";

import { type SettingsProviderProps } from "./types";
import { type SettingsContextValue } from "../types";
import { STORAGE_KEY, defaultSettings } from "../config-settings";

// ----------------------------------------------------------------------

export const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

// ----------------------------------------------------------------------

export function SettingsProvider({
  children,
  settings,
  caches = "localStorage",
}: SettingsProviderProps) {
  const cookies = useCookies(STORAGE_KEY, settings, defaultSettings);

  const localStorage = useLocalStorage(STORAGE_KEY, settings);

  const values = caches === "cookie" ? cookies : localStorage;

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...values.state,
      canReset: values.canReset,
      onReset: values.resetState,
      onUpdate: values.setState,
      onUpdateField: values.setField,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    }),
    [
      values.canReset,
      values.resetState,
      values.setField,
      values.setState,
      values.state,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    ],
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
