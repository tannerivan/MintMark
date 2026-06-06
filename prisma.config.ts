/**
 * Prisma 7 config — connection URLs live here, not in schema.prisma.
 *
 * Neon requires two connection strings:
 *   - DATABASE_URL: pooled connection (PgBouncer) for app queries — low latency, handles serverless concurrency
 *   - DIRECT_URL: direct (non-pooled) connection for migrations — required because PgBouncer doesn't support DDL
 *
 * Both are in .env.local. Never commit those values.
 */
// Load .env.local first (Next.js convention), then fall back to .env.
// dotenv/config only loads .env — Prisma CLI runs outside Next.js and won't
// pick up .env.local automatically, so we load it explicitly here.
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" }); // fallback, won't override already-set vars
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // directUrl (for Neon migrations) is not typed in Prisma 7's defineConfig.
    // Migrations use the CLI directly with DATABASE_URL — the app only needs
    // the pooled URL here.
    url: process.env.DATABASE_URL!,
  },
});
