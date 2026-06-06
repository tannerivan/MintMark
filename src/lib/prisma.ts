/**
 * Prisma client singleton.
 *
 * Next.js hot reload in development creates a new module instance on every
 * change, which would open a new DB connection each time and exhaust Neon's
 * connection pool within minutes. The global singleton pattern prevents this.
 *
 * In production, each Vercel serverless function instance gets exactly one
 * PrismaClient — no issue there.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
