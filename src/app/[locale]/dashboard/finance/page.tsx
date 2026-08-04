"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { FinanceView } from "src/sections/finance/finance-view";
import { FinancePrivacyProvider } from "src/sections/finance/finance-privacy";

export default function DashboardFinancePage() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <FinancePrivacyProvider>
        <FinanceView />
      </FinancePrivacyProvider>
    </RoleBasedGuard>
  );
}
