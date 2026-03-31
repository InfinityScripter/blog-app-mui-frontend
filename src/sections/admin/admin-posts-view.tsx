'use client';

import useSWR from 'swr';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { Iconify } from 'src/components/iconify';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';
import { Box, Card, Chip, Table, Tooltip, TableRow,
  TableBody, TableCell, TableHead, Typography, IconButton, TableContainer } from '@mui/material';

export function AdminPostsView() {
  const { data, mutate } = useSWR(endpoints.post.list, fetcher);
  const posts = (data as any)?.posts ?? [];
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить пост?')) return;
    await axiosInstance.delete(endpoints.admin.postById(id));
    mutate();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Все посты</Typography>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Заголовок</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.author?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.publish}
                      color={p.publish === 'published' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(p.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => router.push(paths.dashboard.post.edit(p.id))}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton color="error" onClick={() => handleDelete(p.id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
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
