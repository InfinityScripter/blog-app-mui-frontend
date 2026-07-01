import { join } from "node:path";
import { readFile } from "node:fs/promises";

// ----------------------------------------------------------------------

// Cyrillic-capable fonts for next/og ImageResponse. The RU post titles are
// Cyrillic, so a Latin-only default renders tofu — Roboto (public/fonts) covers
// Cyrillic. Read from disk at request time; the default node runtime allows fs.

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

async function readFont(file: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(process.cwd(), "public", "fonts", file));
  // Copy the Buffer's bytes into a fresh, standalone ArrayBuffer (no slice over a
  // possibly-pooled backing store, and no type assertion).
  return Uint8Array.from(buffer).buffer;
}

/** Loads the Roboto regular + bold TTFs for ImageResponse `fonts`. */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [regular, bold] = await Promise.all([
    readFont("Roboto-Regular.ttf"),
    readFont("Roboto-Bold.ttf"),
  ]);
  return [
    { name: "Roboto", data: regular, weight: 400, style: "normal" },
    { name: "Roboto", data: bold, weight: 700, style: "normal" },
  ];
}
