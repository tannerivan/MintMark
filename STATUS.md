# MintMark™ — STATUS.md

_Updated: 2026-06-06_

## Complete
- [x] CLAUDE.md, STATUS.md, DECISIONS.md created
- [x] GitHub repo created (public) at github.com/tannerivan/MintMark
- [x] Next.js scaffold (TypeScript, Tailwind, App Router, src dir)
- [x] All Phase 0 deps installed: Clerk, Prisma, Upstash Redis + ratelimit, Stripe, Anthropic SDK, shadcn/ui
- [x] Prisma schema: User, CoinLookup, SavedCoin, DailyChallenge models (Prisma 7 pattern)
- [x] prisma.config.ts: Neon pooled + direct URL configuration
- [x] src/lib/prisma.ts: singleton client
- [x] src/lib/rate-limit.ts: Upstash sliding window, 5/day free, fail-open
- [x] src/middleware.ts: Clerk middleware protecting /dashboard and /collection
- [x] .env.example: every key documented with source instructions
- [x] vercel.json: function timeouts configured
- [x] Phase 0 committed and pushed to GitHub

## In Progress
- Nothing — Phase 0 complete, ready for Phase 1

## Blocked
- Needs real environment variables before migrations can run:
  - DATABASE_URL + DIRECT_URL (Neon)
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY
  - ANTHROPIC_API_KEY
  - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
  - STRIPE_SECRET_KEY + STRIPE_PRO_PRICE_ID

## Next (Phase 1 — Coin Lookup Core)
1. Set up .env.local with real keys (owner-operator action)
2. Run first Prisma migration against Neon
3. Coin search form UI
4. AI analysis API route (server-side, Anthropic SDK)
5. Prompt schema: structured JSON + narrative
6. Results page with scratch-ticket reveal UX
7. PCGS CoinFacts photo integration (hotlink)

## Build Phases
1. **Phase 0 — Foundation**: Scaffold, auth, DB, env, deploy pipeline ← WE ARE HERE
2. **Phase 1 — Coin Lookup Core**: Search UI, AI analysis engine, PCGS photo fetch, results page
3. **Phase 2 — Monetization**: Rate limiting, Stripe subscription, Pro gating
4. **Phase 3 — Collection**: Save coins, collection view (logged-in users)
5. **Phase 4 — Learn Section**: Glossary, error guide, grading basics, term linking
6. **Phase 5 — Pocket Change Challenge**: Daily coin feature, no-login flow
7. **Phase 6 — Polish**: Affiliate links, external reference links, personality pass, mobile QA
