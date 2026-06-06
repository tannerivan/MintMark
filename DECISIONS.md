# MintMark™ — DECISIONS.md

_Every architectural or product decision lives here. One line + reason._

---

## 2026-06-05

| Decision | Reason |
|---|---|
| Next.js App Router (not Pages Router) | Server Components reduce client bundle size and keep API keys server-side by default — critical for Anthropic key security |
| Neon PostgreSQL + Prisma (not Supabase) | Neon serverless driver plays better with Vercel edge functions; Prisma gives typed schema we can evolve safely |
| Clerk (not NextAuth) | Clerk handles free-tier limits, Stripe customer ID sync, and social login without custom session logic — faster to production |
| Anthropic API server-side only | API key exposure in client bundle is an immediate security and cost risk |
| Tailwind + shadcn/ui (not a UI kit) | shadcn gives us unstyled primitives we fully own — no fighting a design system to hit brand personality |
| Rate limiting tracked by user ID + IP fallback | Logged-in users tracked by Clerk user ID; anonymous users tracked by IP to prevent 5-free-lookup bypass via incognito |
| PCGS CoinFacts photos via URL scrape/embed (not stored) | Storing PCGS images would create copyright liability; hotlinking from their public CoinFacts pages is standard numismatic practice |
| Stripe $4.99/month flat (not usage-based) | Beginner audience won't tolerate metered billing anxiety; flat Pro removes the mental tax |
| Pocket Change Challenge requires no login | Removes friction for the "just curious" user — conversion funnel, not a feature gate |
| Glossary term links are quiet (no underlines, tooltip-optional) | Aggressive linking breaks reading flow and signals "textbook" — opposite of brand personality |

---

| PCGS photos via hotlink (Option A) | Known URL pattern construction avoids scraping complexity; revisit if PCGS breaks patterns |
| AI response: structured JSON + narrative summary | JSON populates data slots; narrative carries brand voice — neither alone is enough |
| Upstash Redis for rate limiting | Vercel edge-compatible, effectively free at V1 scale, cleaner than a Neon rate-limit table |
| Pocket Change Challenge: static seeded list (90+ entries) for V1 | Avoids admin interface complexity; AI cron is V2 |
| Affiliate link IDs via environment variables (placeholders now) | Decouples code from business account approval timeline |

| Prisma 7 + Neon: use `PrismaNeonHttp(connectionString)` HTTP adapter | Prisma 7 requires a driver adapter (not schema URL); HTTP adapter is correct for Vercel serverless — no WebSocket, lower cold-start overhead than Pool |
| Removed `ws` and `@prisma/adapter-neon` Pool path | HTTP adapter handles connection internally; WebSocket Pool is for long-lived servers, not serverless functions |

| V2: MintMark Market tier (~$14.99/mo) — eBay completed sales + PCGS/NGC price guide integration | Primary monetization upgrade; V1 valueRange fields designed to accept live data as a drop-in replacement for AI estimates when this layer is ready |
| valueRange schema must remain open for live data replacement | V1 uses AI estimates; V2 replaces with live market data — the field shape stays the same, the data source swaps. Do not close this door. |
| Value disclaimer is a trust feature, not a legal disclaimer | Displayed under every value range: "Values estimated from historical sales data — verify current prices on PCGS, NGC, or eBay completed sales before buying or selling." |
| Four prompt guardrails locked in before Phase 1 code | Bad input handling, value honesty framing, low-confidence behavior, and US-coin-only scope boundary are baked into the AI prompt permanently |

| Next.js 16: middleware.ts → proxy.ts | Next.js 16 deprecated the middleware file convention; renamed to proxy.ts |
| Clerk v7: use auth() directly in Server Components | SignedIn/SignedOut removed from Clerk v7; Server Components call auth() and conditionally render |
| PrismaNeonHttp requires (connectionString, {}) — 2 args | TypeScript signature requires options object as second arg; empty object uses HTTP defaults |
| Prisma client regenerated after every clean npm install | Clean installs wipe node_modules/.prisma/client — add `prisma generate` to postinstall script in V2 |

_Add new decisions below as they're made._
