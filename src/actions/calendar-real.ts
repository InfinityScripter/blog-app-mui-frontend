'use client';

import { useMemo } from 'react';
import useSWR from 'swr';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetEvents() {
  const { data, isLoading, error, mutate } = useSWR(
    endpoints.calendar.events,
    fetcher,
    swrOptions
  );
  return useMemo(
    () => ({
      events: (data as any)?.events ?? [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsMutate: mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

export const createEvent = (data: Record<string, unknown>) =>
  axiosInstance.post(endpoints.calendar.events, data);

export const updateEvent = (id: string, data: Record<string, unknown>) =>
  axiosInstance.patch(endpoints.calendar.event(id), data);

export const deleteEvent = (id: string) =>
  axiosInstance.delete(endpoints.calendar.event(id));
