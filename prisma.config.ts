/**
 * Prisma 7 config — connection URLs live here, not in schema.prisma.
 *
 * Neon requires two connection strings:
 *   - DATABASE_URL: pooled connection (PgBouncer) for app queries — low latency, handles serverless concurrency
 *   - DIRECT_URL: direct (non-pooled) connection for migrations — required because PgBouncer doesn't support DDL
 *
 * Both are in .env.local. Never commit those values.
 */
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
    directUrl: process.env.DIRECT_URL,
  },
});
