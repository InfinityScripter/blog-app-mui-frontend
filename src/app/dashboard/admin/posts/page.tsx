'use client';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';
import { AdminPostsView } from 'src/sections/admin/admin-posts-view';

export default function AdminPostsPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={['admin']}>
      <AdminPostsView />
    </RoleBasedGuard>
  );
}
