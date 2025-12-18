# Stage 1: Build
FROM node:18-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl procps

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# Stage 2: Dependencies
FROM node:18-slim AS deps

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl procps

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm install --omit=dev
RUN npx prisma generate

# Stage 3: Final Image
FROM node:18-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update -y && apt-get install -y openssl procps && \
    rm -rf /var/lib/apt/lists/*

# Copy production artifacts
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]
