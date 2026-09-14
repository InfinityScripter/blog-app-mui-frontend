import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { NON_ADMIN_USER } from "./fixtures";

/**
 * Seeds the non-admin e2e user (and a published post they own) directly into
 * the backend's PostgreSQL database so role-guard / post-scoping / public-blog
 * tests are reproducible.
 *
 * It reads DATABASE_URL from E2E_DATABASE_URL or the sibling backend's .env.
 * If psql or the env file is unavailable, it logs a warning and skips — the
 * admin/public tests still run; only the non-admin specs fail loudly.
 *
 * `users.email` is NOT unique (only `id` is PK; there is a best-effort unique
 * index on LOWER(email)). Never `ON CONFLICT (email)` — Postgres rejects it.
 *
 * Password hash below is bcrypt("@user1").
 */
const NON_ADMIN_PASSWORD_HASH =
  "$2b$10$8hddQPFvs0eklF9Nh9FrWeVHM9JhRDZ4lOHfq8x7p04RQZR6cmPku";

const NON_ADMIN_ID = "test-user-nonadmin";
const OWNED_POST_ID = "test-user-post-1";

/** Denormalized author on the owned post — admin "Все посты" asserts this cell. */
const HELLO_FRIEND_AUTHOR = JSON.stringify({
  name: "Hello Friend",
  avatarUrl: null,
});

function readDatabaseUrl(): string | null {
  // Explicit override wins (CI / non-standard checkouts).
  if (process.env.E2E_DATABASE_URL) {
    return process.env.E2E_DATABASE_URL;
  }

  // The backend lives next to the frontend repo. When running from a git
  // worktree the frontend is nested under .claude/worktrees/<name>, so the
  // plain sibling path ("../../blog-app-mui-backend") misses. Try a few
  // candidate locations and use the first .env that exists.
  const candidates = [
    resolve(__dirname, "..", "..", "blog-app-mui-backend", ".env"),
    resolve(__dirname, "..", "..", "..", "..", "blog-app-mui-backend", ".env"),
    resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "blog-app-mui-backend",
      ".env",
    ),
  ];

  const envPath = candidates.find((p) => existsSync(p));
  if (!envPath) return null;

  const line = readFileSync(envPath, "utf8")
    .split("\n")
    .find((l) => l.startsWith("DATABASE_URL="));
  if (!line) return null;
  return line
    .slice("DATABASE_URL=".length)
    .trim()
    .replace(/^["']|["']$/g, "");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function execStderr(error: unknown): string {
  if (typeof error !== "object" || error === null || !("stderr" in error)) {
    return "";
  }
  const { stderr } = error;
  return typeof stderr === "string" ? stderr : "";
}

function seedSql(): string {
  return `
INSERT INTO users (
  id, name, email, password_hash, is_email_verified, role,
  personal_data_consent_at, personal_data_consent_version
) VALUES (
  '${NON_ADMIN_ID}',
  'Test User',
  '${NON_ADMIN_USER.email}',
  '${NON_ADMIN_PASSWORD_HASH}',
  true,
  'user',
  NOW(),
  'ci'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  is_email_verified = true,
  role = 'user',
  personal_data_consent_at = COALESCE(users.personal_data_consent_at, NOW()),
  personal_data_consent_version = COALESCE(users.personal_data_consent_version, 'ci');

INSERT INTO posts (
  id, title, description, content, user_id, publish, author
) VALUES (
  '${OWNED_POST_ID}',
  'Test User own post',
  'Seeded for e2e',
  '<p>Seeded for e2e so the public post detail page has a body.</p>',
  '${NON_ADMIN_ID}',
  'published',
  '${HELLO_FRIEND_AUTHOR}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  user_id = EXCLUDED.user_id,
  publish = 'published',
  author = EXCLUDED.author;
`;
}

export default function globalSetup() {
  const dbUrl = readDatabaseUrl();
  if (!dbUrl) {
    console.warn(
      "[e2e seed] DATABASE_URL not found — skipping non-admin user seed.",
    );
    return;
  }

  try {
    execFileSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-c", seedSql()], {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
    console.log("[e2e seed] non-admin user + owned post ensured.");
  } catch (error) {
    console.warn(
      "[e2e seed] psql seed failed — non-admin test may fail:",
      errorMessage(error),
      execStderr(error),
    );
  }
}
