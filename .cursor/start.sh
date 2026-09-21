#!/usr/bin/env bash
# Cloud Agent start — per-boot reconciliation. Brings up PostgreSQL, ensures
# the app database + role, and seeds the changelog. Idempotent; returns once
# the DB is ready. The frontend/backend dev servers run as `terminals`.
set -euo pipefail

BACKEND_DIR="$HOME/blog-app-mui-backend"
DB_URL="postgresql://postgres:postgres@localhost:5432/blog_app"

# Start the cluster (no-op if already running) and wait for readiness.
sudo pg_ctlcluster 16 main start || true
for _ in $(seq 1 15); do
  if sudo -u postgres pg_isready -q; then break; fi
  sleep 1
done

# Role password + database (both idempotent).
sudo -u postgres psql -tAc "ALTER USER postgres PASSWORD 'postgres';" >/dev/null
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='blog_app';" | grep -q 1 \
  || sudo -u postgres createdb blog_app

# Seed changelog releases so /changelog + /llm-timeline show real data.
# ON CONFLICT (slug) DO NOTHING — re-running never duplicates.
if [ -f "$BACKEND_DIR/scripts/seed-changelog.mjs" ]; then
  DATABASE_URL="$DB_URL" node "$BACKEND_DIR/scripts/seed-changelog.mjs" --apply || true
fi
