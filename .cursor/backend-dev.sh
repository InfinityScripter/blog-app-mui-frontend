#!/usr/bin/env bash
# Cloud Agent terminal — the backend API dev server (:7272). Runs from the
# cloned sibling repo; migrations apply automatically on the first request.
set -euo pipefail

cd "$HOME/blog-app-mui-backend"

# Seed the changelog once the API is up. Migrations run on the first request,
# so `model_releases` only exists after the server has served one — hitting
# /api/post/list creates the schema, then the (idempotent) seed populates it.
(
  for _ in $(seq 1 60); do
    if curl -sf -o /dev/null "http://localhost:7272/api/post/list"; then
      DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_app" \
        node scripts/seed-changelog.mjs --apply >/dev/null 2>&1 || true
      break
    fi
    sleep 2
  done
) &

exec yarn dev
