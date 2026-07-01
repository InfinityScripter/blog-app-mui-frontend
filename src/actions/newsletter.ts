import axios, { endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------
// Newsletter double-opt-in actions. Backend wraps writes in ok() →
// { success, data: { ... } }, so the payload we care about lives under
// `res.data.data` (the same data.data nesting the changelog feature uses).

interface SubscribeResponse {
  success: boolean;
  data: { subscriber: { id: string; email: string; status: string } };
}

export async function subscribeToNewsletter(
  email: string,
): Promise<SubscribeResponse> {
  const res = await axios.post<SubscribeResponse>(
    endpoints.newsletter.subscribe,
    { email },
  );
  return res.data;
}

interface StatusResponse {
  success: boolean;
  data: {
    subscriber?: { email: string; status: string };
    email?: string;
    status?: string;
  };
}

export async function confirmSubscription(
  token: string,
): Promise<StatusResponse> {
  const res = await axios.get<StatusResponse>(
    `${endpoints.newsletter.confirm}?token=${encodeURIComponent(token)}`,
  );
  return res.data;
}

export async function unsubscribeFromNewsletter(
  token: string,
): Promise<StatusResponse> {
  const res = await axios.get<StatusResponse>(
    `${endpoints.newsletter.unsubscribe}?token=${encodeURIComponent(token)}`,
  );
  return res.data;
}
