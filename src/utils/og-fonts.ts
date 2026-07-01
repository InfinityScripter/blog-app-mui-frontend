import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

// Cyrillic-capable fonts for next/og ImageResponse. The RU post titles are
// Cyrillic, so a Latin-only default renders tofu — Roboto (public/fonts) covers
// Cyrillic. Fetched over HTTP from the site's public/fonts rather than read from
// disk: on Vercel a DYNAMIC og route runs as a serverless function whose bundle
// does NOT include public/, so fs.readFile('public/fonts/..') throws ENOENT
// (/var/task/public/fonts/... missing). The public URL is always reachable.

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

async function fetchFont(file: string): Promise<ArrayBuffer> {
  const res = await fetch(`${CONFIG.site.url}/fonts/${file}`);
  if (!res.ok) {
    throw new Error(`og font fetch failed: ${file} (${res.status})`);
  }
  return res.arrayBuffer();
}

/** Loads the Roboto regular + bold TTFs for ImageResponse `fonts`. */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [regular, bold] = await Promise.all([
    fetchFont("Roboto-Regular.ttf"),
    fetchFont("Roboto-Bold.ttf"),
  ]);
  return [
    { name: "Roboto", data: regular, weight: 400, style: "normal" },
    { name: "Roboto", data: bold, weight: 700, style: "normal" },
  ];
}
