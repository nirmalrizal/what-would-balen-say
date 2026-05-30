#!/usr/bin/env bash
set -euo pipefail

HEALTH_URL="https://whatwouldbalensay.com"
HEALTH_TIMEOUT=60
TAIL_LINES=50

log() { echo "[$(date '+%H:%M:%S')] $*"; }

log "Building new image..."
docker compose build --no-cache app

log "Starting new container alongside the old one..."
docker compose up -d --no-deps --wait app

log "Waiting for app to be healthy (timeout: ${HEALTH_TIMEOUT}s)..."
deadline=$(( $(date +%s) + HEALTH_TIMEOUT ))
while true; do
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$HEALTH_URL" || true)
  if [[ "$status" == "200" ]]; then
    log "Health check passed (HTTP $status)."
    break
  fi
  if [[ $(date +%s) -ge $deadline ]]; then
    log "ERROR: Health check timed out after ${HEALTH_TIMEOUT}s (last status: $status)."
    log "--- app logs (last $TAIL_LINES lines) ---"
    docker compose logs --tail="$TAIL_LINES" app
    exit 1
  fi
  log "  status=$status — retrying..."
  sleep 3
done

log "Deployment complete."
log ""
log "--- app logs (last $TAIL_LINES lines) ---"
docker compose logs --tail="$TAIL_LINES" app
