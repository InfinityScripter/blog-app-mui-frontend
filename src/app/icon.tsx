import { ImageResponse } from "next/og";

// ----------------------------------------------------------------------

// Favicon — Editorial Ink aifirst mark: warm-ink tile, bone terminal caret,
// vermilion cursor block. Matches src/components/logo/logo.tsx.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1C1917",
          borderRadius: 7,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 512 512" fill="none">
          <rect width="512" height="512" rx="116" fill="#1C1917" />
          <polyline
            points="168,166 282,256 168,346"
            fill="none"
            stroke="#FAFAF9"
            strokeWidth="46"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="300"
            y="166"
            width="52"
            height="180"
            rx="14"
            fill="#E8552E"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
