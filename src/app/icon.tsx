import { ImageResponse } from "next/og";

// ----------------------------------------------------------------------

// Favicon — a rounded green tile with a white "T" monogram, matching the
// in-app Logo component (src/components/logo/logo.tsx).

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
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background:
            "linear-gradient(135deg, #5BE49B 0%, #00A76F 55%, #007867 100%)",
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
        }}
      >
        T
      </div>
    ),
    { ...size },
  );
}
