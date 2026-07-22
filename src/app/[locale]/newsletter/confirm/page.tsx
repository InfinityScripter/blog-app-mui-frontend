import { notFound } from "next/navigation";
import { fetchPdCollectionEnabled } from "src/actions/settings-ssr";

import { NewsletterConfirmView } from "./confirm-view";

// Read the runtime flag per request (no ISR) so an admin toggle takes effect
// immediately. Confirming completes a subscription (collects PD); when collection
// is disabled the route 404s to match the backend gate — otherwise a late click
// on a confirm link would surface the raw backend "Not found" as the page
// message. Unsubscribe stays open so people can always leave.
export const dynamic = "force-dynamic";

export default async function Page() {
  const pdCollectionEnabled = await fetchPdCollectionEnabled();
  if (!pdCollectionEnabled) {
    notFound();
  }

  return <NewsletterConfirmView />;
}
