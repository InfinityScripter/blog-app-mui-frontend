import { ImageResponse } from "next/og";
import { CONFIG } from "src/config-global";
import { loadOgFonts } from "src/utils/og-fonts";

// ----------------------------------------------------------------------

// Site-wide OpenGraph card. Rendered dynamically (default node runtime, so `fs`
// works) instead of shipping a static /assets/og-image.jpg that didn't exist.
// Mirrors the branded monogram tile from the in-app Logo / favicon (icon.tsx).

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${CONFIG.site.name} — AI-агрегатор новостей`;

const BRAND_GRADIENT =
  "linear-gradient(135deg, #5BE49B 0%, #00A76F 55%, #007867 100%)";

export default async function OpengraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_GRADIENT,
          color: "#FFFFFF",
          fontFamily: "Roboto",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 48,
            background: "rgba(255,255,255,0.16)",
            fontSize: 140,
            fontWeight: 800,
          }}
        >
          T
        </div>
        <div style={{ marginTop: 48, fontSize: 64, fontWeight: 700 }}>
          {CONFIG.site.name}
        </div>
        <div style={{ marginTop: 12, fontSize: 32, opacity: 0.9 }}>
          AI-агрегатор новостей
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
