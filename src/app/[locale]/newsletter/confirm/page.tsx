"use client";

import { confirmSubscription } from "src/actions/newsletter";

import { NewsletterStatus } from "../newsletter-status";
import { useTokenAction } from "../hooks/use-token-action";

export default function Page() {
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
