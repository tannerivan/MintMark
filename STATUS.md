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

## Complete
### Phase 1 — Coin Lookup Core ✅
- [x] AI engine: full prompt, all guardrails, structured JSON + narrative
- [x] valueRange.dataSource field kept open for V2 live market swap
- [x] src/lib/coin-data.ts: 31 series across 6 denominations
- [x] src/lib/pcgs.ts: photo URLs, reference links, grading links, affiliate via env
- [x] POST /api/lookup: rate limit → AI → DB → response
- [x] POST /api/webhooks/clerk: svix-verified user sync
- [x] Home page with search form (Clerk v7 auth() pattern)
- [x] Results page: server-rendered, data from DB
- [x] CoinSearchForm: full form with personality loading state
- [x] ResultsReveal: 8-card scratch-ticket reveal with staggered animations
- [x] CoinPhoto: PCGS hotlink + graceful fallback
- [x] ValueRange: 3-column display + non-negotiable disclaimer
- [x] ExternalLinks: PCGS, NGC, Coppercoins, CONECA + grading links
- [x] MintMark brand tokens: copper palette, reveal animations
- [x] Build: ✓ clean, 0 TypeScript errors

## In Progress
- Nothing — Phase 1 complete, ready for live test then Phase 2

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
