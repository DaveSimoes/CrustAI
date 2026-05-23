# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ─── App stage ────────────────────────────────────────────────────────────────
FROM base AS app

WORKDIR /app

# Copy source code
COPY src/       ./src/
COPY config/    ./config/
COPY scripts/   ./scripts/

# Create data directory for local database
RUN mkdir -p /app/data

# Expose REST API port
EXPOSE 3000

# Health check — hits the CrustAI REST API
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start CrustAI
CMD ["node", "src/core/index.js"]
