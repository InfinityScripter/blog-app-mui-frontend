// Triggers on-demand ISR revalidation of the public blog pages via the
// same-origin Next route handler (`/api/revalidate`). Unlike the other actions
// in this folder, this does NOT go through the backend axios instance — the
// route lives in THIS Next app, so it must be called same-origin (respecting
// NEXT_PUBLIC_BASE_PATH), with the admin JWT the dashboard already holds.
//
// Used two ways:
//   • fire-and-forget after a post is published/edited (fresh cache, no wait);
//   • the "Обновить кеш" button in the admin posts view (manual recovery).

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function revalidatePublicPosts(
  accessToken?: string,
): Promise<boolean> {
  if (!accessToken) return false;
  try {
    const res = await fetch(`${BASE_PATH}/api/revalidate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
