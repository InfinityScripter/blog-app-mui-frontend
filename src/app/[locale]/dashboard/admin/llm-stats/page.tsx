"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { AdminLlmStatsView } from "src/sections/admin/llm-stats/llm-stats-view";

export default function AdminLlmStatsPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <AdminLlmStatsView />
    </RoleBasedGuard>
  );
}
