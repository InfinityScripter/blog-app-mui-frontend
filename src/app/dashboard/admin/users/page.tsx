'use client';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';
import { AdminUsersView } from 'src/sections/admin/admin-users-view';

export default function AdminUsersPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={['admin']}>
      <AdminUsersView />
    </RoleBasedGuard>
  );
}
