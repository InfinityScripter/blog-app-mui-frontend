"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { AdminAuditLogsView } from "src/sections/admin/admin-audit-logs-view";

export default function AdminAuditLogsPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <AdminAuditLogsView />
    </RoleBasedGuard>
  );
}
