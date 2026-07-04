import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// On-demand ISR revalidation. The public blog pages are cached with
// `revalidate = 3600` (1h), so a freshly published/edited post — or a page that
// cached a transient backend error as a 404 during a deploy window — can stay
// stale for up to an hour. This route drops that cache immediately.
//
// Guarded by the caller's admin JWT (the same token the dashboard already
// holds): the incoming `Authorization: Bearer <token>` is verified against the
// backend `/api/auth/me`, and only `role === "admin"` may revalidate. No static
// shared secret to manage, and it reuses the existing auth model.

export const dynamic = "force-dynamic";

// Revalidating the `/post/[id]` *page* segment refreshes ALL post pages at once
// (no need to enumerate ids); same for `/tag/[slug]`. The list/feed pages that
// embed post cards are refreshed alongside.
const POST_PAGE_SEGMENTS = ["/post/[id]", "/tag/[slug]"] as const;
const LIST_PATHS = ["/", "/news", "/changelog"] as const;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

async function isAdmin(authHeader: string | null): Promise<boolean> {
  if (!authHeader) return false;
  try {
    const res = await fetch(`${SERVER_URL}/api/auth/me`, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data: { user?: { role?: string } } = await res.json();
    return data.user?.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req.headers.get("authorization")))) {
    return NextResponse.json(
      { revalidated: false, message: "Admin only" },
      { status: 403 },
    );
  }

  // Refresh every post/tag page in one shot (dynamic-segment revalidation), plus
  // the list/feed pages that show post cards.
  POST_PAGE_SEGMENTS.forEach((segment) => revalidatePath(segment, "page"));
  LIST_PATHS.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true });
}
