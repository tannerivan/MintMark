/**
 * MintMark™ Coin Lookup API Route
 * POST /api/lookup
 *
 * The order window between front-of-house (the form) and the kitchen (the AI).
 *
 * Flow:
 * 1. Parse and validate the coin input
 * 2. Identify user (Clerk userId if logged in, IP if anonymous)
 * 3. Check rate limit (5/day free, Pro bypasses)
 * 4. Call AI analysis engine
 * 5. Store result in Neon DB
 * 6. Return result + lookupId to client
 *
 * Rate limit is checked BEFORE the AI call — never burn a credit then block.
 * DB write happens AFTER the AI call — if AI fails, nothing is stored.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyzeCoin } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse input ──────────────────────────────────────────────────────
    const body = await req.json();
    const { year, mintMark, denomination, series } = body;

    if (!year || !denomination) {
      return NextResponse.json(
        { error: "Year and denomination are required." },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1793 || yearNum > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: "Please enter a valid year (1793 to present)." },
        { status: 400 }
      );
    }

    // ── 2. Identify user ─────────────────────────────────────────────────────
    const { userId } = await auth();

    // Rate limit key: Clerk user ID for logged-in users (can't be bypassed),
    // IP address for anonymous users (best-effort)
    let rateLimitKey: string;
    let ipAddress: string | null = null;

    if (userId) {
      rateLimitKey = `user:${userId}`;
    } else {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "unknown";
      ipAddress = ip;
      rateLimitKey = `ip:${ip}`;
    }

    // ── 3. Check subscription status + rate limit ────────────────────────────
    let isPro = false;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionStatus: true },
      });
      isPro = user?.subscriptionStatus === "active";
    }

    const rateCheck = await checkRateLimit(rateLimitKey, isPro);
    if (!rateCheck.allowed) {
      const resetsAt = rateCheck.resetsAt;
      const hoursUntilReset = Math.ceil(
        (resetsAt.getTime() - Date.now()) / (1000 * 60 * 60)
      );
      return NextResponse.json(
        {
          error: "daily_limit_reached",
          message: `You've used your 5 free lookups for today. Resets in about ${hoursUntilReset} hour${hoursUntilReset === 1 ? "" : "s"}.`,
          resetsAt: resetsAt.toISOString(),
          upgradeUrl: "/upgrade",
        },
        { status: 429 }
      );
    }

    // ── 4. Call AI ───────────────────────────────────────────────────────────
    const analysis = await analyzeCoin({
      year: yearNum,
      mintMark: mintMark || null,
      denomination,
      series: series || null,
    });

    // ── 5. Store in DB ───────────────────────────────────────────────────────
    const lookup = await prisma.coinLookup.create({
      data: {
        year: yearNum,
        mintMark: mintMark || null,
        denomination,
        series: series || null,
        analysisJson: analysis as object,
        narrative: analysis.narrative,
        userId: userId ?? null,
        ipAddress: userId ? null : ipAddress, // never store IP for logged-in users
      },
    });

    // ── 6. Return ────────────────────────────────────────────────────────────
    return NextResponse.json({
      lookupId: lookup.id,
      analysis,
    });
  } catch (err) {
    console.error("[MintMark] /api/lookup error:", err);

    // Don't expose internals — the kitchen had a problem, here's what the
    // customer sees
    return NextResponse.json(
      {
        error: "Something went wrong in the vault. Try that one again.",
      },
      { status: 500 }
    );
  }
}
