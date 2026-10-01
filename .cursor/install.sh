#!/usr/bin/env bash
# Cloud Agent install — runs once after checkout to build the environment
# baseline (cached in the build snapshot). Idempotent: safe to re-run.
#
# The frontend hard-depends on the backend API (:7272) for SSR: the home /
# news / changelog / llm-timeline pages and `yarn build` (strict prerender)
# all 500 with ECONNREFUSED when it is absent. So we also install PostgreSQL
# and clone + install the sibling backend repo here. The backend repo itself
# is never edited (see AGENTS.md — it lives in a separate repo).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$HOME/blog-app-mui-backend"
BACKEND_REPO="https://github.com/infinityscripter/blog-app-mui-backend"

# 1. System dependency: PostgreSQL (stable — lands in the build snapshot).
if ! command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql postgresql-contrib
fi

# 2. Frontend dependencies.
cd "$REPO_ROOT"
yarn install --frozen-lockfile

# 3. Frontend env — SSR/asset fetches point at the local backend (:7272).
if [ ! -f "$REPO_ROOT/.env.local" ]; then
  cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env.local"
fi

# 4. Backend (public sibling repo) — clone + install so the API is available.
if [ ! -d "$BACKEND_DIR/.git" ]; then
  git clone --depth 1 "$BACKEND_REPO" "$BACKEND_DIR"
fi
cd "$BACKEND_DIR"
git pull --ff-only origin main || true
yarn install

# 5. Backend env — local Postgres, OpenSearch unset (falls back to PG search).
if [ ! -f "$BACKEND_DIR/.env" ]; then
  cat > "$BACKEND_DIR/.env" <<'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blog_app
JWT_SECRET=secret123
PD_COLLECTION_ENABLED=false
BACKEND_URL=http://localhost:7272
FRONTEND_URL=http://localhost:3033
EOF
fi
