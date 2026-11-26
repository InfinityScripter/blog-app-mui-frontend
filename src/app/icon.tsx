import { ImageResponse } from "next/og";

// ----------------------------------------------------------------------

// Favicon — Life Style mark: plum tile, cream caret, lime cursor.
// 192px, not 32: Google Search recommends a favicon larger than 48×48 and
// showed a generic globe for the 32px one; browsers downscale it for the tab.

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#351C2F",
        borderRadius: 42,
      }}
    >
      <svg width="192" height="192" viewBox="0 0 512 512" fill="none">
        <rect width="512" height="512" rx="116" fill="#351C2F" />
        <polyline
          points="168,166 282,256 168,346"
          fill="none"
          stroke="#FCF2E8"
          strokeWidth="46"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="300" y="166" width="52" height="180" rx="14" fill="#EEF091" />
      </svg>
    </div>,
    { ...size },
  );
}
