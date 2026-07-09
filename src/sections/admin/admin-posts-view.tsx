"use client";

import useSWR from "swr";
import { useState } from "react";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { toast } from "src/components/snackbar";
import { useAuthContext } from "src/auth/hooks";
import { Iconify } from "src/components/iconify";
import { PUBLISH_STATUS } from "src/types/domain";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
import { revalidatePublicPosts } from "src/actions/revalidate-posts";
import {
  Box,
  Card,
  Chip,
  Table,
  Stack,
  Button,
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
  const { authenticated } = useAuthContext();

  // Auth rides in the httpOnly cookie (axios withCredentials). Gate the key on
  // `authenticated` so the request doesn't fire before login — otherwise the
  // backend answers as unauthenticated (0 admin rows) instead of the admin
  // "all posts" branch. Null key until authenticated → no race.
  const { data, mutate } = useSWR<AdminPostsResponse>(
    authenticated ? endpoints.post.list : null,
    fetcher,
  );
  const posts = data?.posts ?? [];
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [revalidating, setRevalidating] = useState(false);

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    if (!window.confirm("Удалить пост?")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(endpoints.admin.postById(id));
      mutate();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Не удалось удалить пост");
    } finally {
      setDeletingId(null);
    }
  };

  // Manually drop the public ISR cache for all post/list pages — recovery for a
  // post stuck as a stale 404 after a backend deploy, or to force fresh content
  // without waiting out the 1h revalidate window.
  const handleRevalidate = async () => {
    if (revalidating) return;
    setRevalidating(true);
    try {
      const ok = await revalidatePublicPosts();
      if (ok) {
        toast.success("Кеш обновлён — публичные страницы пересоберутся");
      } else {
        toast.error("Не удалось обновить кеш");
      }
    } finally {
      setRevalidating(false);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Все посты</Typography>
        <Tooltip title="Сбросить кеш публичных страниц (посты, лента, новости). Помогает, если пост завис с ошибкой 404 после деплоя.">
          <span>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRevalidate}
              disabled={revalidating}
              startIcon={<Iconify icon="solar:refresh-bold" />}
            >
              Обновить кеш
            </Button>
          </span>
        </Tooltip>
      </Stack>
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
                        aria-label="Редактировать"
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
                        aria-label="Удалить"
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
