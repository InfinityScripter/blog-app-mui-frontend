import { useEffect } from "react";

// ----------------------------------------------------------------------

const FONT_URLS: Record<string, string> = {
  "Golos Text":
    "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap",
  "IBM Plex Sans":
    "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
  Rubik:
    "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap",
};

export function useFontLoader(fontFamily: string): void {
  useEffect(() => {
    const url = FONT_URLS[fontFamily];

    if (!url) return; // Manrope (bundled via next/font) and unknown fonts — skip

    const id = `font-link-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;

    if (document.getElementById(id)) return; // already loaded

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }, [fontFamily]);
}
