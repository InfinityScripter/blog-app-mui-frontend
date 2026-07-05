import { ImageResponse } from "next/og";
import { CONFIG } from "src/config-global";
import { getPost } from "src/actions/blog-ssr";
import { toAppLocale } from "src/i18n/locales";
import { loadOgFonts } from "src/utils/og-fonts";

// ----------------------------------------------------------------------

// Per-post OpenGraph card: the RU post title over the brand background. Title is
// Cyrillic → the Roboto TTF is embedded via `fonts` (fetched from public/fonts,
// see og-fonts) so satori doesn't render tofu. A missing/unreachable post falls
// back to the site name, never a broken image.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = CONFIG.site.name;

const BRAND_GRADIENT =
  "linear-gradient(135deg, #5BE49B 0%, #00A76F 55%, #007867 100%)";

interface ImageProps {
  params: Promise<{ id: string; locale: string }>;
}

async function resolveTitle(id: string, locale: string): Promise<string> {
  try {
    const { post } = await getPost(id, toAppLocale(locale));
    return post?.title ?? CONFIG.site.name;
  } catch {
    return CONFIG.site.name;
  }
}

export default async function PostOpengraphImage({ params }: ImageProps) {
  const { id, locale } = await params;
  const [fonts, title] = await Promise.all([
    loadOgFonts(),
    resolveTitle(id, locale),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: BRAND_GRADIENT,
          color: "#FFFFFF",
          fontFamily: "Roboto",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            background: "rgba(255,255,255,0.16)",
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          T
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 30, opacity: 0.9 }}>{CONFIG.site.name}</div>
      </div>
    ),
    { ...size, fonts },
  );
}
