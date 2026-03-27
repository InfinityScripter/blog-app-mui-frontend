import useSWR from "swr";
import { useMemo } from "react";
import { keyBy } from "src/utils/helper";
import { fetcher, endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

interface Label {
  id: string;
  type: string;
  name: string;
  unreadCount: number;
  color: string;
  [key: string]: unknown;
}

interface LabelsResponse {
  labels: Label[];
}

export function useGetLabels() {
  const url = endpoints.mail.labels;

  const { data, isLoading, error, isValidating } = useSWR<LabelsResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      labels: data?.labels ?? [],
      labelsLoading: isLoading,
      labelsError: error,
      labelsValidating: isValidating,
      labelsEmpty: !isLoading && !(data?.labels?.length ?? 0),
    }),
    [data?.labels, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

interface Mail {
  id: string;
  labelIds: string[];
  folder: string;
  isImportant: boolean;
  isStarred: boolean;
  isUnread: boolean;
  subject: string;
  message: string;
  createdAt: Date | string;
  [key: string]: unknown;
}

interface MailsResponse {
  mails: Mail[];
}

export function useGetMails(labelId: string | null) {
  const url = labelId ? [endpoints.mail.list, { params: { labelId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR<MailsResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(() => {
    const byId = data?.mails?.length ? keyBy(data.mails, "id") : {};
    const allIds = Object.keys(byId);

    return {
      mails: { byId, allIds },
      mailsLoading: isLoading,
      mailsError: error,
      mailsValidating: isValidating,
      mailsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.mails, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

interface MailResponse {
  mail: Mail;
}

export function useGetMail(mailId: string | null) {
  const url = mailId ? [endpoints.mail.details, { params: { mailId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR<MailResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      mail: data?.mail,
      mailLoading: isLoading,
      mailError: error,
      mailValidating: isValidating,
    }),
    [data?.mail, error, isLoading, isValidating],
  );

  return memoizedValue;
}
