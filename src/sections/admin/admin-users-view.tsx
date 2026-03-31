'use client';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, IconButton, Tooltip,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useGetAdminUsers, deleteUser } from 'src/actions/admin';
import { useAuthContext } from 'src/auth/hooks';

export function AdminUsersView() {
  const { users, usersLoading, usersMutate } = useGetAdminUsers();
  const { user } = useAuthContext();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить пользователя?')) return;
    await deleteUser(id);
    usersMutate();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Пользователи</Typography>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата регистрации</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      color={u.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.isEmailVerified ? 'Верифицирован' : 'Не верифицирован'}
                      color={u.isEmailVerified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>
                    {u.id !== user?.id && (
                      <Tooltip title="Удалить">
                        <IconButton color="error" onClick={() => handleDelete(u.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
