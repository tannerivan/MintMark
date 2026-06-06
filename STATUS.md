# MintMark™ — STATUS.md

_Updated: 2026-06-06_

## Complete
- [x] CLAUDE.md, STATUS.md, DECISIONS.md created
- [x] GitHub repo created (public) at github.com/tannerivan/MIntMark
- [x] Next.js scaffold (TypeScript, Tailwind, App Router, src dir)

## In Progress
- [ ] Phase 0: cleaning scaffold, fixing git remote, installing all deps

## Blocked
- Nothing

## Next
1. Install all deps: Prisma, Clerk, Upstash Redis, Stripe, Anthropic SDK, shadcn/ui
2. Prisma schema: User sync, CoinLookup, Collection, DailyChallenge
3. `.env.example` with every key documented
4. Clerk middleware
5. Upstash rate limit utility
6. Vercel config + deploy hook

## Build Phases
1. **Phase 0 — Foundation**: Scaffold, auth, DB, env, deploy pipeline ← WE ARE HERE
2. **Phase 1 — Coin Lookup Core**: Search UI, AI analysis engine, PCGS photo fetch, results page
3. **Phase 2 — Monetization**: Rate limiting, Stripe subscription, Pro gating
4. **Phase 3 — Collection**: Save coins, collection view (logged-in users)
5. **Phase 4 — Learn Section**: Glossary, error guide, grading basics, term linking
6. **Phase 5 — Pocket Change Challenge**: Daily coin feature, no-login flow
7. **Phase 6 — Polish**: Affiliate links, external reference links, personality pass, mobile QA
