/**
 * MintMark™ Rate Limiter
 *
 * Free tier: 5 lookups per calendar day (UTC midnight reset).
 * Pro tier: unlimited — bypasses this check entirely.
 *
 * Key strategy:
 *   - Authenticated users  → keyed by Clerk userId    (can't be bypassed via incognito)
 *   - Anonymous users      → keyed by IP address       (best-effort; can be bypassed)
 *
 * We use a sliding window of 24h rather than a fixed calendar reset because:
 *   1. Simpler to implement correctly across timezones
 *   2. Prevents the "lookup 5 at 11:59pm, 5 more at 12:00am" exploit
 *
 * If Upstash is unreachable, we ALLOW the request and log the error.
 * Blocking users because our rate limiter is down is worse than a few extra free lookups.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimiter(): Ratelimit | null {
  // Lazy init — env vars aren't available at module load time in some edge runtimes
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("[MintMark] Upstash env vars not set — rate limiting disabled");
    return null;
  }

  const redis = new Redis({ url, token });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "24 h"),
    analytics: false, // keep it simple for V1
    prefix: "mintmark:lookup",
  });

  return ratelimit;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; resetsAt: Date };

/**
 * Check whether a lookup is allowed for the given identifier.
 *
 * @param identifier  Clerk userId for logged-in users, IP address for anonymous.
 * @param isPro       If true, always returns allowed — Pro users are unlimited.
 */
export async function checkRateLimit(
  identifier: string,
  isPro: boolean
): Promise<RateLimitResult> {
  if (isPro) return { allowed: true };

  const limiter = getRatelimiter();

  // If rate limiter is unavailable, allow the request (fail open)
  if (!limiter) return { allowed: true };

  try {
    const result = await limiter.limit(identifier);

    if (result.success) {
      return { allowed: true };
    }

    // result.reset is a Unix timestamp in milliseconds
    return { allowed: false, resetsAt: new Date(result.reset) };
  } catch (err) {
    // Upstash unreachable — fail open, log the error
    console.error("[MintMark] Rate limit check failed — allowing request:", err);
    return { allowed: true };
  }
}

/**
 * Get remaining lookups for the identifier without consuming one.
 * Used to show "X of 5 free lookups remaining" in the UI.
 */
export async function getRemainingLookups(
  identifier: string,
  isPro: boolean
): Promise<number | null> {
  if (isPro) return null; // null = unlimited

  const limiter = getRatelimiter();
  if (!limiter) return null;

  try {
    // getRemaining is a dry check — doesn't consume a slot
    const result = await limiter.getRemaining(identifier);
    return result.remaining;
  } catch {
    return null;
  }
}
