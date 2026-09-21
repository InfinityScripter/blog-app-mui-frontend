#!/usr/bin/env bash
# Cloud Agent start — per-boot reconciliation. Brings up PostgreSQL and ensures
# the app database + role. Idempotent; returns once the DB is ready. The
# frontend/backend dev servers run as `terminals`; the backend also seeds the
# changelog once it is up (migrations apply on its first request, so the schema
# only exists after that — see backend-dev.sh).
set -euo pipefail

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
