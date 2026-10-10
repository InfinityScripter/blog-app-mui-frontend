import { ImageResponse } from "next/og";

// ----------------------------------------------------------------------

// Favicon — Life Style mark: plum tile, cream caret, lime cursor.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#351C2F",
        borderRadius: 7,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 512 512" fill="none">
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
