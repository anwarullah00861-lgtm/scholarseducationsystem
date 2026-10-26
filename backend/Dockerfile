# syntax=docker/dockerfile:1
# Multi-stage build for the Scholars Education System NestJS API.

FROM node:24-alpine AS build
WORKDIR /app
# Prisma engine needs OpenSSL on Alpine.
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
COPY prisma ./prisma
# Prisma CLI ships in dependencies so migrations can run at container start.
RUN npm ci --omit=dev && npm cache clean --force
RUN npx prisma generate
COPY --from=build /app/dist ./dist
RUN mkdir -p uploads/admissions
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-3000}/" > /dev/null || exit 1
# Apply pending migrations, then start the API.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
