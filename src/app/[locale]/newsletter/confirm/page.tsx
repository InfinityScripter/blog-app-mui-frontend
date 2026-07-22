"use client";

import { notFound } from "next/navigation";
import { CONFIG } from "src/config-global";
import { confirmSubscription } from "src/actions/newsletter";

import { NewsletterStatus } from "../newsletter-status";
import { useTokenAction } from "../hooks/use-token-action";

export default function Page() {
  // Confirming completes a subscription (collects PD). When collection is
  // disabled the route 404s to match the backend gate — otherwise a late click
  // on a confirm link would surface the raw backend "Not found" as the page
  // message. Unsubscribe stays open so people can always leave.
  if (!CONFIG.features.pdCollection) {
    notFound();
  }

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
