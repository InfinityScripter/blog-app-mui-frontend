'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetBoards() {
  const { data, isLoading, error, mutate } = useSWR(
    endpoints.kanban.boards,
    fetcher,
    swrOptions
  );
  return useMemo(
    () => ({
      boards: (data as any)?.boards ?? [],
      boardsLoading: isLoading,
      boardsError: error,
      boardsMutate: mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

export function useGetBoard(boardId: string | null) {
  const { data, isLoading, error, mutate } = useSWR(
    boardId ? endpoints.kanban.board(boardId) : null,
    fetcher,
    swrOptions
  );
  return useMemo(
    () => ({
      board: (data as any)?.board ?? null,
      boardLoading: isLoading,
      boardError: error,
      boardMutate: mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

export const createColumn = (boardId: string, name: string) =>
  axiosInstance.post(endpoints.kanban.columns(boardId), { name });

export const createTask = (columnId: string, title: string) =>
  axiosInstance.post(endpoints.kanban.tasks(columnId), { title });

export const updateTask = (taskId: string, data: Record<string, unknown>) =>
  axiosInstance.patch(endpoints.kanban.task(taskId), data);

export const deleteTask = (taskId: string) =>
  axiosInstance.delete(endpoints.kanban.task(taskId));
