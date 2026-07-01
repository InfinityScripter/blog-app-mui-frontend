"use client";

import { unsubscribeFromNewsletter } from "src/actions/newsletter";

import { NewsletterStatus } from "../newsletter-status";
import { useTokenAction } from "../hooks/use-token-action";

export default function Page() {
  const { status, message, redirectIn } = useTokenAction(
    unsubscribeFromNewsletter,
    "Вы отписались от рассылки",
    "Ссылка недействительна — токен отсутствует",
  );

  return (
    <NewsletterStatus
      status={status}
      message={message}
      redirectIn={redirectIn}
      loadingText="Обрабатываем отписку..."
    />
  );
}
