import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { NON_ADMIN_USER } from "./fixtures";

/**
 * Seeds the non-admin e2e user (and a post they own) directly into the
 * backend's PostgreSQL database so role-guard / post-scoping tests are
 * reproducible.
 *
 * It reads DATABASE_URL from the sibling backend's .env. If psql or the env
 * file is unavailable, it logs a warning and skips — the admin/public tests
 * still run; only the non-admin test will fail loudly if the user is missing.
 *
 * Password hash below is bcrypt("@user1").
 */
const NON_ADMIN_PASSWORD_HASH =
  "$2b$10$8hddQPFvs0eklF9Nh9FrWeVHM9JhRDZ4lOHfq8x7p04RQZR6cmPku";

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

export default function globalSetup() {
  const dbUrl = readDatabaseUrl();
  if (!dbUrl) {
    console.warn(
      "[e2e seed] DATABASE_URL not found — skipping non-admin user seed.",
    );
    return;
  }

  const sql = `
INSERT INTO users (id, name, email, password_hash, is_email_verified, role)
VALUES ('test-user-nonadmin', 'Test User', '${NON_ADMIN_USER.email}',
        '${NON_ADMIN_PASSWORD_HASH}', true, 'user')
ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash, is_email_verified = true, role = 'user';

INSERT INTO posts (id, title, user_id, publish, author)
VALUES ('test-user-post-1', 'Test User own post', 'test-user-nonadmin', 'published',
        '{"name":"Test User","avatarUrl":null}'::jsonb)
ON CONFLICT (id) DO UPDATE
  SET title = EXCLUDED.title, user_id = EXCLUDED.user_id, publish = 'published';
`;

  try {
    execFileSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-c", sql], {
      stdio: "pipe",
    });
    console.log("[e2e seed] non-admin user + owned post ensured.");
  } catch (err) {
    console.warn(
      "[e2e seed] psql seed failed — non-admin test may fail:",
      (err as Error).message,
    );
  }
}
