export function modelFamily(model: string): string {
  const m = model.toLowerCase();
  if (m.includes("opus")) return "opus";
  if (m.includes("sonnet")) return "sonnet";
  if (m.includes("haiku")) return "haiku";
  if (m.includes("synthetic")) return "synthetic";
  if (m.includes("gpt-4o")) return "gpt-4o";
  if (m.includes("gpt-5") || m.includes("gpt5")) return "gpt-5";
  if (m.startsWith("o3") || m.includes("/o3")) return "o3";
  if (m.startsWith("o1") || m.includes("/o1")) return "o1";
  if (m.includes("codex")) return "codex";
  if (m.includes("glm")) return "glm";
  if (m.includes("deepseek")) return "deepseek";
  if (m.includes("gemini")) return "gemini";
  return m;
}

export function providerOf(model: string): string {
  const m = model.toLowerCase();
  if (m.includes("claude") || m.includes("anthropic")) return "anthropic";
  if (
    m.includes("gpt") ||
    m.startsWith("o1") ||
    m.startsWith("o3") ||
    m.includes("codex")
  )
    return "openai";
  if (m.includes("glm")) return "zhipu";
  if (m.includes("deepseek")) return "deepseek";
  if (m.includes("gemini")) return "google";
  return "unknown";
}

export function projectOf(cwd: string | null): string | null {
  if (!cwd) return null;
  const parts = cwd.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
}

export function dateParts(iso: string): {
  dateKey: string;
  weekday: number;
  hour: number;
} {
  const d = new Date(iso);
  const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  return { dateKey, weekday: d.getDay(), hour: d.getHours() };
}
