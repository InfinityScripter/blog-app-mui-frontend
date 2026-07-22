// Server-side read of the runtime pdCollection flag, for pages that must gate
// (404) before rendering — sign-up and newsletter/confirm. Uses native fetch
// with no caching so an admin toggle takes effect on the next request (these are
// low-traffic form pages, so per-request freshness is fine and they don't need
// ISR). Do NOT import SWR here (RSC import issues, same as blog-ssr).
//
// Fail-closed: if the backend is unreachable or errors, we return false so the
// gate treats collection as OFF. A privacy gate must never fall open — better a
// 404 on a transient blip than exposing personal-data collection with no flag.

import { endpoints } from "src/utils/axios";

interface PublicSettingsEnvelope {
  data?: { pdCollection?: boolean };
}

export async function fetchPdCollectionEnabled(): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  try {
    const res = await fetch(`${baseUrl}${endpoints.settings.public}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      // Log so a persistent backend/config problem is distinguishable in the
      // server logs from a deliberate flag-off (both render the gated 404).
      console.error(
        `[fetchPdCollectionEnabled] settings fetch returned ${res.status}, failing closed`,
      );
      return false;
    }
    const body: PublicSettingsEnvelope = await res.json();
    return body.data?.pdCollection === true;
  } catch (error) {
    // Network error, bad NEXT_PUBLIC_SERVER_URL, or malformed JSON — all covered
    // by this catch and all fail closed. Logged so a misconfigured deploy isn't
    // silently and permanently stuck at "collection off".
    console.error(
      "[fetchPdCollectionEnabled] settings fetch failed, failing closed",
      error,
    );
    return false;
  }
}
