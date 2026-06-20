"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { paths } from "src/routes/paths";
import { useState, useCallback } from "react";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { AccountGeneral } from "../account-general";
import { AccountChangePassword } from "../account-change-password";

import type { AccountTabValue } from "../types";

// ----------------------------------------------------------------------

const TABS = [
  {
    value: "general",
    label: "Общие",
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: "security",
    label: "Безопасность",
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
] as const;

// ----------------------------------------------------------------------

export function AccountView() {
  const [currentTab, setCurrentTab] = useState<AccountTabValue>("general");

  const handleChangeTab = useCallback(
    (_event: React.SyntheticEvent, newValue: AccountTabValue) => {
      setCurrentTab(newValue);
    },
    [],
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Аккаунт"
        links={[
          { name: "Панель управления", href: paths.dashboard.root },
          { name: "Пользователь" },
          { name: "Аккаунт" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </Tabs>

      {currentTab === "general" && <AccountGeneral />}

      {currentTab === "security" && <AccountChangePassword />}
    </DashboardContent>
  );
}
