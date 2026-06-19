"use client";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: string;
  color: string;
  createdBy: string;
}

export type CalendarEventInput = Pick<
  CalendarEvent,
  "title" | "start" | "end" | "type" | "color"
>;

interface CalendarEventsResponse {
  events: CalendarEvent[];
}

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetEvents() {
  const { data, isLoading, error, mutate } = useSWR<CalendarEventsResponse>(
    endpoints.calendar.events,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      events: data?.events ?? [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export const createEvent = (data: CalendarEventInput) =>
  axiosInstance.post(endpoints.calendar.events, data);

export const updateEvent = (id: string, data: Partial<CalendarEventInput>) =>
  axiosInstance.patch(endpoints.calendar.event(id), data);

export const deleteEvent = (id: string) =>
  axiosInstance.delete(endpoints.calendar.event(id));
