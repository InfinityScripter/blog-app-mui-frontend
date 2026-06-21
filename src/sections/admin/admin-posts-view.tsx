"use client";

import useSWR from "swr";
import { useState } from "react";
import { paths } from "src/routes/paths";
import { useRouter } from "next/navigation";
import { useAuthContext } from "src/auth/hooks";
import { Iconify } from "src/components/iconify";
import { PUBLISH_STATUS } from "src/types/domain";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
import {
  Box,
  Card,
  Chip,
  Table,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from "@mui/material";

import type { AdminPostsResponse } from "./types";

export function AdminPostsView() {
  const { user } = useAuthContext();
  const accessToken = user?.accessToken;

  // Передаём токен в ключ SWR явно: иначе на свежем логине запрос уходит
  // до того, как setSession проставит Authorization в axios.defaults — и
  // бэкенд отдаёт посты по userId-фильтру (для админа это 0 строк) вместо
  // admin-ветки «все посты». Ключ null до появления токена → нет гонки.
  const { data, mutate } = useSWR<AdminPostsResponse>(
    accessToken
      ? [
          endpoints.post.list,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ]
      : null,
    fetcher,
  );
  const posts = data?.posts ?? [];
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    if (!window.confirm("Удалить пост?")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(endpoints.admin.postById(id));
      mutate();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Все посты
      </Typography>
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
              {posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.author?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.publish}
                      color={
                        p.publish === PUBLISH_STATUS.published
                          ? "success"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(p.createdAt ?? "").toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Редактировать">
                      <IconButton
                        onClick={() =>
                          router.push(paths.dashboard.post.edit(p.id ?? ""))
                        }
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(p.id ?? "")}
                        disabled={deletingId === (p.id ?? "")}
                      >
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
