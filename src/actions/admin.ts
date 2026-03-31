'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetAdminUsers() {
  const { data, isLoading, error, mutate } = useSWR(
    endpoints.admin.users,
    fetcher,
    swrOptions
  );
  return useMemo(() => ({
    users: (data as any)?.users ?? [],
    usersLoading: isLoading,
    usersError: error,
    usersMutate: mutate,
  }), [data, isLoading, error, mutate]);
}

export async function deleteUser(id: string) {
  await axiosInstance.delete(endpoints.admin.userById(id));
}
