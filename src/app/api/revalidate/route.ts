import { LOCALES } from "src/i18n/locales";
import { revalidatePath } from "next/cache";
import { endpoints } from "src/utils/axios";
import { NextResponse, type NextRequest } from "next/server";

// On-demand ISR revalidation. The public blog pages are cached with
// `revalidate = 3600` (1h), so a freshly published/edited post — or a page that
// cached a transient backend error as a 404 during a deploy window — can stay
// stale for up to an hour. This route drops that cache immediately.
//
// Guarded by the caller's admin session: the incoming request's auth cookies
// are forwarded to the backend `/api/auth/me`, and only `role === "admin"` may
// revalidate. The auth cookies are shared across the FE and API subdomains (via
// COOKIE_DOMAIN in prod), so a same-origin request to this route carries the
// httpOnly access_token cookie, which we relay to the backend. No static shared
// secret to manage, and it reuses the existing cookie auth model.

export const dynamic = "force-dynamic";

// Every public PAGE lives under the localized tree (`/ru/...`, `/en/...` —
// `localePrefix: "always"`), so one layout-scoped revalidation of `/[locale]`
// drops every localized page cache (home feed, blog list, /post/[id],
// /tag/[slug], /news, /changelog) for all locales at once. Feed and metadata
// ROUTE HANDLERS sit outside the page/layout tree, so each is revalidated by
// its literal URL — per locale where the route is localized.
const FEED_AND_METADATA_PATHS = [
  "/feed.xml",
  "/llms.txt",
  "/sitemap.xml",
  ...LOCALES.flatMap((locale) => [
    `/${locale}/news/feed.xml`,
    `/${locale}/changelog/feed.xml`,
  ]),
];

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

async function isAdmin(cookieHeader: string | null): Promise<boolean> {
  if (!cookieHeader) return false;
  try {
    const res = await fetch(`${SERVER_URL}${endpoints.auth.me}`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data: { user?: { role?: string } } = await res.json();
    return data.user?.role === "admin";
  } catch (error) {
    // Deny on failure, but leave a trace: an unreachable backend otherwise
    // presents to a legitimate admin as an inexplicable 403.
    console.error("[revalidate] admin check failed:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req.headers.get("cookie")))) {
    return NextResponse.json(
      { revalidated: false, message: "Admin only" },
      { status: 403 },
    );
  }

  revalidatePath("/[locale]", "layout");
  FEED_AND_METADATA_PATHS.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true });
}
