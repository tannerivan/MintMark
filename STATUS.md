# MintMark™ — STATUS.md

_Updated: 2026-06-06_

## Complete
### Phase 0 — Foundation ✅
- [x] CLAUDE.md, STATUS.md, DECISIONS.md created
- [x] GitHub repo created (public) at github.com/tannerivan/MintMark
- [x] Next.js scaffold (TypeScript, Tailwind, App Router, src dir)
- [x] All deps installed: Clerk, Prisma, Upstash Redis + ratelimit, Stripe, Anthropic SDK, shadcn/ui
- [x] Prisma schema: User, CoinLookup, SavedCoin, DailyChallenge models
- [x] Prisma 7 + Neon HTTP adapter wired correctly (PrismaNeonHttp)
- [x] prisma.config.ts: loads .env.local, Neon pooled + direct URL
- [x] src/lib/prisma.ts: singleton client
- [x] src/lib/rate-limit.ts: Upstash sliding window, 5/day free, fail-open
- [x] src/middleware.ts: Clerk protecting /dashboard and /collection
- [x] .env.example: every key documented
- [x] vercel.json: AI lookup route gets 30s timeout
- [x] Initial migration applied — all 4 tables live in Neon
- [x] Neon DB + Upstash Redis both confirmed connected
- [x] GitHub remote corrected to github.com/tannerivan/MintMark

## In Progress
### Phase 1 — Coin Lookup Core 🔄
- [x] Prompt schema designed and reviewed by owner-operator
- [x] Four guardrails locked in (bad input, value honesty, low confidence, scope)
- [x] Value disclaimer language approved
- [x] V2 MintMark Market tier logged in DECISIONS.md — door kept open
- [ ] Owner-operator final sign-off on complete recipe card → then code starts

## Blocked
- STRIPE_PRO_PRICE_ID still placeholder — not blocking until Phase 2

## Next (Phase 1 — Coin Lookup Core)
1. App shell: layout, global nav, brand identity
2. Coin search form (year, mint mark, denomination, series)
3. AI analysis API route — Anthropic SDK, server-side only
4. Prompt schema: structured JSON fields + narrative summary
5. Results page with scratch-ticket reveal UX
6. PCGS CoinFacts photo integration (hotlink via URL pattern)
7. External reference links (PCGS, NGC, Coppercoins, CONECA)
8. Clerk webhook handler (sync user to DB on sign-up)

## Build Phases
1. **Phase 0 — Foundation** ✅ Complete
2. **Phase 1 — Coin Lookup Core** ← WE ARE HERE
3. **Phase 2 — Monetization**: Rate limiting UI, Stripe subscription, Pro gating
4. **Phase 3 — Collection**: Save coins, collection view
5. **Phase 4 — Learn Section**: Glossary, error guide, grading basics, term linking
6. **Phase 5 — Pocket Change Challenge**: Daily coin feature, no-login flow
7. **Phase 6 — Polish**: Affiliate links, personality pass, mobile QA
