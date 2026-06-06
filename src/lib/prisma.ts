/**
 * Prisma client singleton — Neon HTTP + Prisma 7.
 *
 * Prisma 7 requires a driver adapter. For Neon serverless we use the HTTP
 * adapter (PrismaNeonHTTP + neon()) rather than the WebSocket Pool adapter.
 * HTTP is the right default for Vercel serverless functions: no persistent
 * connection, no WebSocket setup, lower cold-start overhead.
 *
 * The Pool/WebSocket adapter is better for long-lived servers — not us.
 *
 * Singleton pattern: Next.js hot reload in dev creates a new module instance
 * on every file change, which would open a new connection each time. The
 * globalThis pattern prevents this without affecting production behavior.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("[MintMark] DATABASE_URL is not set");
  }

  // PrismaNeonHttp takes the connection string and HTTP query options.
  // Empty options object uses Neon HTTP defaults — correct for serverless.
  const adapter = new PrismaNeonHttp(connectionString, {});

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
