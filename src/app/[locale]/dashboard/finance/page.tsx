"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { FinanceView } from "src/sections/finance/finance-view";

export default function DashboardFinancePage() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <FinanceView />
    </RoleBasedGuard>
  );
}
