"use client";

import { confirmSubscription } from "src/actions/newsletter";

import { NewsletterStatus } from "../newsletter-status";
import { useTokenAction } from "../hooks/use-token-action";

// Client body of the confirm page. The server page (page.tsx) gates on the
// runtime pdCollection flag before this mounts, so the confirm request here only
// fires when collection is enabled — a disabled flag never reaches the backend
// confirm route (which would surface a raw "Not found").
export function NewsletterConfirmView() {
  const { status, message, redirectIn } = useTokenAction(
    confirmSubscription,
    "Подписка подтверждена",
    "Ссылка недействительна — токен отсутствует",
  );

  return (
    <NewsletterStatus
      status={status}
      message={message}
      redirectIn={redirectIn}
      loadingText="Подтверждаем подписку..."
    />
  );
}
