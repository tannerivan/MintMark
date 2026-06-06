# MintMark™ — CLAUDE.md

## What This Is
MintMark is a US coin lookup web app for collectors — beginner-first, AI-powered, personality-forward.
Users type a coin (year + mint mark + denomination) and get instant: errors/varieties, key date status,
grade ceiling, grading recommendation, and estimated value. Reference photos from PCGS CoinFacts.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: Neon PostgreSQL via Prisma ORM
- **Auth**: Clerk
- **AI**: Anthropic API (Claude)
- **Payments**: Stripe ($4.99/month Pro)
- **Rate Limiting**: Upstash Redis
- **Deployment**: Vercel
- **Repo**: github.com/tannerivan/MIntMark

## Who We're Building For
A beginner who found a weird penny and wants to know if they're holding something.
Excited, not expert. Needs confidence and clarity, not a database dump.

## Personality Contract — Non-Negotiable
MintMark has a voice: knowledgeable friend who loves coins and just got excited.
Results feel like a scratch ticket reveal. Empty states keep treasure-hunt energy alive.
Error states have personality. Fun is a feature. Nothing screams at the user.

## Design Direction
Discovery energy. Treasure hunt meets financial intelligence. Premium but accessible.
Not clinical, not cheap. Feels like it's been the industry standard forever.

## V1 Feature Scope
**In:**
- Coin lookup (year, mint mark, denomination, series)
- AI analysis: errors/varieties, key date status, mintage, grade ceiling, grading recommendation
- Reference photo from PCGS CoinFacts (hotlinked via known URL patterns)
- Links to PCGS, NGC, Coppercoins, CONECA
- Save to collection (logged-in users)
- 5 free lookups/day, unlimited on Pro
- Stripe subscription at $4.99/month
- PCGS/NGC affiliate links on grading recommendations (IDs via env vars)
- Pocket Change Challenge: daily free "look for this today", no login required, 90+ static entries for V1
- Learn section: glossary, error types guide, grading basics, how to submit for grading
- Technical terms in analysis quietly link to glossary definitions

**Out (V1):**
No photo upload, no price alerts, no community features, no foreign coins, no marketplace.

## Conventions
- App Router only — no Pages Router
- Server Components by default; Client Components only when interactivity requires it
- Prisma for all DB access — no raw SQL except in migrations
- All AI calls server-side — API key never touches the client
- Stripe webhooks handled in `/app/api/webhooks/stripe/route.ts`
- Clerk middleware protects `/dashboard` and `/collection` routes
- Rate limiting via Upstash Redis — tracked per Clerk user ID, fallback to IP for anonymous
- Environment variables documented in `.env.example` — never commit `.env.local`
- Component naming: PascalCase files, kebab-case directories
- Tailwind for all styling — no CSS modules, no styled-components
- shadcn/ui for base components, customized to brand
- Every architectural or product decision goes in DECISIONS.md immediately

## How We Work
- Owner-operator reviews every phase before next begins
- Senior dev (Claude) explains WHY on every non-obvious architectural choice — one sentence
- STATUS.md updated at end of every session without being asked
- No code outside V1 scope
- Personality is enforced at code review — clinical copy gets rejected
