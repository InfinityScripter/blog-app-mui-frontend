"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { AdminBotView } from "src/sections/admin/admin-bot-view";

export default function AdminBotPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <AdminBotView />
    </RoleBasedGuard>
  );
}
