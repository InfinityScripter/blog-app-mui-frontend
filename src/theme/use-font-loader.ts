import { useEffect } from "react";

// ----------------------------------------------------------------------

const FONT_URLS: Record<string, string> = {
  Inter:
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  Roboto:
    "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  Lato:
    "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
};

export function useFontLoader(fontFamily: string): void {
  useEffect(() => {
    const url = FONT_URLS[fontFamily];

    if (!url) return; // Public Sans and unknown fonts — skip

    const id = `font-link-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;

    if (document.getElementById(id)) return; // already loaded

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }, [fontFamily]);
}
