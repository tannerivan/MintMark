/**
 * MintMark™ Results Page — /lookup/[id]
 *
 * Server Component: fetches the CoinLookup record from Neon by ID,
 * passes analysis data to ResultsReveal (Client Component) for the
 * animated scratch-ticket reveal.
 */

import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import type { CoinAnalysisResult } from "@/lib/anthropic";
import ResultsReveal from "@/components/results/ResultsReveal";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lookup = await prisma.coinLookup.findUnique({ where: { id } });
  if (!lookup) return { title: "Coin Not Found" };

  const mintMark = lookup.mintMark ? `-${lookup.mintMark}` : "";
  const name = `${lookup.year}${mintMark} ${lookup.denomination}`;

  return {
    title: `${name} — Coin Analysis`,
    description: lookup.narrative ?? `MintMark AI analysis for the ${name}.`,
  };
}

export default async function LookupPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();

  const lookup = await prisma.coinLookup.findUnique({ where: { id } });
  if (!lookup) notFound();

  const analysis = lookup.analysisJson as unknown as CoinAnalysisResult;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <Link
          href="/"
          className="font-display font-bold text-xl text-copper tracking-tight hover:text-copper-light transition-colors"
        >
          MintMark™
        </Link>
        {userId && (
          <div className="flex items-center gap-3">
            <Link href="/collection" className="text-sm text-text-secondary hover:text-copper transition-colors">
              My Collection
            </Link>
            <UserButton />
          </div>
        )}
      </header>

      {/* Results */}
      <main className="flex-1 px-5 py-8">
        <ResultsReveal
          analysis={analysis}
          coinIdentity={{
            year: lookup.year,
            mintMark: lookup.mintMark,
            denomination: lookup.denomination,
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-display font-semibold text-sm text-copper">MintMark™</span>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <Link href="/learn" className="hover:text-copper transition-colors">Learn</Link>
          <Link href="/pocket-change" className="hover:text-copper transition-colors">Daily Challenge</Link>
          <Link href="/upgrade" className="hover:text-copper transition-colors">Pro</Link>
        </div>
      </footer>
    </div>
  );
}
