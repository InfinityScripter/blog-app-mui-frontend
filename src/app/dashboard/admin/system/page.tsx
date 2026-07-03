"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { AdminSystemMetricsView } from "src/sections/admin/system/system-metrics-view";

export default function AdminSystemMetricsPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <AdminSystemMetricsView />
    </RoleBasedGuard>
  );
}
