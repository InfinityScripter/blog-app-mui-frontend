"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { AdminSettingsView } from "src/sections/admin/admin-settings-view";

export default function AdminSettingsPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <AdminSettingsView />
    </RoleBasedGuard>
  );
}
