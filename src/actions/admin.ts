"use client";

import type { User } from "src/types/domain";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

export interface AdminUser extends User {
  createdAt?: string | Date;
}

interface AdminUsersResponse {
  users: AdminUser[];
}

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetAdminUsers() {
  const { data, isLoading, error, mutate } = useSWR<AdminUsersResponse>(
    endpoints.admin.users,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      users: data?.users ?? [],
      usersLoading: isLoading,
      usersError: error,
      usersMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export async function deleteUser(id: string) {
  await axiosInstance.delete(endpoints.admin.userById(id));
}
