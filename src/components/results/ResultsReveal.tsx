"use client";

/**
 * ResultsReveal — the scratch-ticket reveal experience.
 *
 * Each card animates in from below with staggered delays.
 * The beat between cards is intentional — this is the UX.
 *
 * Card order (the sequence matters — tell the story in the right order):
 * 0. Coin photo + identity (what is this thing?)
 * 1. Narrative (the emotional hook — make them feel something)
 * 2. Key date badge (if applicable — big news lands first)
 * 3. Errors & varieties (what makes it interesting)
 * 4. Grade ceiling (what condition is realistic)
 * 5. Value range (the number they came for)
 * 6. Grading recommendation (should I act on this?)
 * 7. External links (where to go next)
 */

import CoinPhoto from "./CoinPhoto";
import ValueRangeCard from "./ValueRange";
import ExternalLinks from "./ExternalLinks";
import { buildPcgsDetailUrl, buildPcgsSearchUrl, buildPcgsImageUrl } from "@/lib/pcgs";
import type { CoinAnalysisResult } from "@/lib/anthropic";

interface ResultsRevealProps {
  analysis: CoinAnalysisResult;
  coinIdentity: { year: number; mintMark: string | null; denomination: string };
}

export default function ResultsReveal({ analysis, coinIdentity }: ResultsRevealProps) {
  const { year, mintMark, denomination } = coinIdentity;

  const imageUrl = buildPcgsImageUrl(analysis.pcgsCoinId);
  const pcgsDetailUrl = analysis.pcgsCoinId
    ? buildPcgsDetailUrl(analysis.pcgsCoinId)!
    : buildPcgsSearchUrl({ year, mintMark, denomination });

  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">

      {/* Card 0 — Photo + coin identity */}
      <div className="animate-reveal-up reveal-delay-0 flex flex-col items-center gap-3">
        <CoinPhoto
          imageUrl={imageUrl}
          coinName={analysis.coinIdentity.displayName}
          pcgsDetailUrl={pcgsDetailUrl}
        />
        <h1 className="text-2xl font-display font-bold text-text text-center leading-tight">
          {analysis.coinIdentity.displayName}
        </h1>
        {analysis.mintage && (
          <p className="text-sm text-text-secondary text-center">
            <span className="font-semibold tabular-nums">
              {analysis.mintage.toLocaleString()}
            </span>{" "}
            minted
            {analysis.mintageContext && (
              <span className="text-text-muted"> · {analysis.mintageContext}</span>
            )}
          </p>
        )}
      </div>

      {/* Confidence notice — shown for medium/low confidence */}
      {analysis.confidence !== "high" && analysis.confidenceNote && (
        <div className="animate-reveal-up reveal-delay-1 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 flex gap-3 items-start">
          <span className="text-gold text-base mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-medium text-gold">
              {analysis.confidence === "medium" ? "Some uncertainty" : "Limited data"}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">{analysis.confidenceNote}</p>
          </div>
        </div>
      )}

      {/* Card 1 — Narrative */}
      <div className="animate-reveal-up reveal-delay-1 rounded-xl border border-border bg-surface p-5">
        <p className="text-text leading-relaxed text-[15px]">{analysis.narrative}</p>
      </div>

      {/* Card 2 — Key date badge */}
      {analysis.keyDate && (
        <div className="animate-reveal-up reveal-delay-2 rounded-xl border border-copper/50 bg-copper/10 p-5 flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center text-copper text-lg">
            ★
          </div>
          <div>
            <p className="font-semibold text-copper text-sm uppercase tracking-wider mb-1">Key Date</p>
            <p className="text-text text-sm leading-relaxed">
              {analysis.keyDateExplanation ?? "This is a key date coin — lower mintage or historically significant."}
            </p>
          </div>
        </div>
      )}

      {/* Card 3 — Errors & varieties */}
      {(analysis.errors.length > 0 || analysis.varieties.length > 0) && (
        <div className="animate-reveal-up reveal-delay-3 rounded-xl border border-border bg-surface p-5 space-y-4">
          {analysis.errors.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Known Errors
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.errors.map((error) => (
                  <span
                    key={error}
                    className="rounded-md border border-copper/30 bg-copper/5 px-2.5 py-1 text-xs font-medium text-copper"
                  >
                    {error}
                  </span>
                ))}
              </div>
            </div>
          )}
          {analysis.varieties.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Known Varieties
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.varieties.map((v) => (
                  <span
                    key={v}
                    className="rounded-md border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-text-secondary"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* If no errors or varieties — say so cleanly */}
      {analysis.errors.length === 0 && analysis.varieties.length === 0 && analysis.confidence === "high" && (
        <div className="animate-reveal-up reveal-delay-3 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Errors & Varieties
          </h3>
          <p className="text-sm text-text-muted">
            No documented errors or varieties for this date and mint mark.
          </p>
        </div>
      )}

      {/* Card 4 — Grade ceiling */}
      {analysis.gradeCeiling && (
        <div className="animate-reveal-up reveal-delay-4 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
            Grade Ceiling — Circulated Find
          </h3>
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-lg border border-border bg-surface-raised px-4 py-2 text-center">
              <span className="text-xl font-bold font-display text-text tabular-nums">
                {analysis.gradeCeiling}
              </span>
            </div>
            {analysis.gradeCeilingReasoning && (
              <p className="text-sm text-text-secondary leading-relaxed">
                {analysis.gradeCeilingReasoning}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Card 5 — Value range */}
      {analysis.valueRange && (
        <div className="animate-reveal-up reveal-delay-5 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-4">
            Estimated Value Range
          </h3>
          <ValueRangeCard valueRange={analysis.valueRange} />
        </div>
      )}

      {/* Card 6 — Grading recommendation */}
      <div className="animate-reveal-up reveal-delay-6 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 rounded-full w-10 h-10 flex items-center justify-center text-lg ${analysis.worthGrading ? "bg-copper/15 text-copper" : "bg-surface-raised text-text-muted"}`}>
            {analysis.worthGrading ? "✓" : "—"}
          </div>
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
              Worth Grading?
            </h3>
            <p className={`text-base font-semibold mb-1 ${analysis.worthGrading ? "text-copper" : "text-text"}`}>
              {analysis.worthGrading ? "Yes — consider submitting" : "Probably not"}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {analysis.worthGradingReasoning}
            </p>
          </div>
        </div>
      </div>

      {/* Card 7 — External links */}
      <div className="animate-reveal-up reveal-delay-7 rounded-xl border border-border bg-surface p-5">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
          Dig Deeper
        </h3>
        <ExternalLinks
          year={year}
          mintMark={mintMark}
          denomination={denomination}
          pcgsCoinId={analysis.pcgsCoinId}
          worthGrading={analysis.worthGrading}
        />
      </div>

      {/* New search prompt */}
      <div className="animate-reveal-up reveal-delay-7 text-center pt-2 pb-6">
        <a
          href="/"
          className="text-sm text-text-muted hover:text-copper transition-colors"
        >
          ← Look up another coin
        </a>
      </div>
    </div>
  );
}
