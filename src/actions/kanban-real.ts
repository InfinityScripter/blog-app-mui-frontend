"use client";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

export interface KanbanTask {
  id: string;
  title: string;
  description?: string | null;
  position: number;
}

export interface KanbanColumn {
  id: string;
  name: string;
  position: number;
  tasks: KanbanTask[];
}

export interface KanbanBoardSummary {
  id: string;
  name: string;
  description?: string | null;
}

export interface KanbanBoard extends KanbanBoardSummary {
  columns: KanbanColumn[];
}

export interface KanbanTaskUpdate {
  columnId?: string;
  position?: number;
  title?: string;
  description?: string | null;
}

interface BoardsResponse {
  boards: KanbanBoardSummary[];
}

interface BoardResponse {
  board: KanbanBoard;
}

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetBoards() {
  const { data, isLoading, error, mutate } = useSWR<BoardsResponse>(
    endpoints.kanban.boards,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      boards: data?.boards ?? [],
      boardsLoading: isLoading,
      boardsError: error,
      boardsMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export function useGetBoard(boardId: string | null) {
  const { data, isLoading, error, mutate } = useSWR<BoardResponse>(
    boardId ? endpoints.kanban.board(boardId) : null,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      board: data?.board ?? null,
      boardLoading: isLoading,
      boardError: error,
      boardMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export const createBoard = (
  name: string,
  description?: string,
  memberIds?: string[],
) =>
  axiosInstance.post<BoardResponse>(endpoints.kanban.boards, {
    name,
    description,
    memberIds: memberIds ?? [],
  });

export const createColumn = (boardId: string, name: string) =>
  axiosInstance.post(endpoints.kanban.columns(boardId), { name });

export const createTask = (columnId: string, title: string) =>
  axiosInstance.post(endpoints.kanban.tasks(columnId), { title });

export const updateTask = (taskId: string, data: KanbanTaskUpdate) =>
  axiosInstance.patch(endpoints.kanban.task(taskId), data);

export const deleteTask = (taskId: string) =>
  axiosInstance.delete(endpoints.kanban.task(taskId));

export const deleteColumn = (columnId: string) =>
  axiosInstance.delete(endpoints.kanban.column(columnId));

export const deleteBoard = (boardId: string) =>
  axiosInstance.delete(endpoints.kanban.board(boardId));
