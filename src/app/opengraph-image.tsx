import { ImageResponse } from "next/og";
import { loadOgFonts } from "src/utils/og-fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Life Style — ИИ простыми словами, игры и шпиц";

export default async function OpengraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#351C2F",
        color: "#FCF2E8",
        fontFamily: "Roboto",
      }}
    >
      <div style={{ fontSize: 120, fontWeight: 800 }}>Life Style</div>
      <div style={{ marginTop: 24, display: "flex", fontSize: 40 }}>
        ИИ&nbsp;
        <span
          style={{
            background: "#EEF091",
            color: "#1E1220",
            padding: "0 12px",
            borderRadius: 8,
          }}
        >
          простыми
        </span>
        &nbsp;словами, игры и шпиц
      </div>
    </div>,
    { ...size, fonts },
  );
}
