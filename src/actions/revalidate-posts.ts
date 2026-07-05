// Triggers on-demand ISR revalidation of the public blog pages via the
// same-origin Next route handler (`/api/revalidate`). Unlike the other actions
// in this folder, this does NOT go through the backend axios instance — the
// route lives in THIS Next app, so it must be called same-origin (respecting
// NEXT_PUBLIC_BASE_PATH). Auth is the httpOnly cookie the browser sends
// automatically; the route forwards it to the backend /me to confirm admin.
//
// Used two ways:
//   • fire-and-forget after a post is published/edited (fresh cache, no wait);
//   • the "Обновить кеш" button in the admin posts view (manual recovery).

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function revalidatePublicPosts(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_PATH}/api/revalidate`, {
      method: "POST",
      credentials: "same-origin",
    });
    return res.ok;
  } catch {
    return false;
  }
}
