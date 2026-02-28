# ── Stage 1: Build Frontend ──
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build Backend ──
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# ── Stage 3: Production ──
FROM node:18-alpine AS production
WORKDIR /app

# Copy backend compiled code + production deps
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

COPY --from=backend-build /app/backend/dist ./dist

# Copy frontend built files
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

WORKDIR /app/backend

# Expose port (App Runner / ECS expects 8080)
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "dist/server.js"]
