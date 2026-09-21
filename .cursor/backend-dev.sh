#!/usr/bin/env bash
# Cloud Agent terminal — the backend API dev server (:7272). Runs from the
# cloned sibling repo; migrations apply automatically on first request.
set -euo pipefail

cd "$HOME/blog-app-mui-backend"
exec yarn dev
