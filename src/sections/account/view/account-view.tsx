"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { paths } from "src/routes/paths";
import { useState, useCallback } from "react";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { ACCOUNT_TABS } from "./const";
import { AccountGeneral } from "../account-general";
import { AccountChangePassword } from "../account-change-password";

import type { AccountTabValue } from "../types";

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
        {ACCOUNT_TABS.map((tab) => (
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
