"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DENOMINATIONS, MINT_MARKS, ALL_SERIES } from "@/lib/coin-data";

export default function CoinSearchForm() {
  const router = useRouter();
  const [year, setYear]             = useState("");
  const [mintMark, setMintMark]     = useState("");
  const [denomination, setDenom]    = useState("");
  const [series, setSeries]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [limitData, setLimitData]   = useState<{ resetsAt: string; upgradeUrl: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLimitData(null);

    if (!year || !denomination) {
      setError("Year and denomination are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, mintMark, denomination, series }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "daily_limit_reached") {
          setLimitData({ resetsAt: data.resetsAt, upgradeUrl: data.upgradeUrl });
          setError(data.message);
        } else {
          setError(data.error ?? "Something went wrong. Try again.");
        }
        return;
      }

      router.push(`/lookup/${data.lookupId}`);
    } catch {
      setError("Couldn't reach the vault. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Year + Mint Mark row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="year" className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
            Year
          </label>
          <input
            id="year"
            type="number"
            min={1793}
            max={new Date().getFullYear() + 1}
            placeholder="e.g. 1955"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-lg bg-surface-raised border border-border px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-copper focus:border-transparent transition-all text-lg tabular-nums"
            required
          />
        </div>

        <div>
          <label htmlFor="mintMark" className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
            Mint Mark
          </label>
          <select
            id="mintMark"
            value={mintMark}
            onChange={(e) => setMintMark(e.target.value)}
            className="w-full rounded-lg bg-surface-raised border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-copper focus:border-transparent transition-all h-[52px]"
          >
            {MINT_MARKS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.value || "None"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Denomination */}
      <div>
        <label htmlFor="denomination" className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
          Denomination
        </label>
        <select
          id="denomination"
          value={denomination}
          onChange={(e) => setDenom(e.target.value)}
          className="w-full rounded-lg bg-surface-raised border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-copper focus:border-transparent transition-all"
          required
        >
          <option value="" disabled>Select denomination…</option>
          {DENOMINATIONS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Series (optional) */}
      <div>
        <label htmlFor="series" className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
          Series <span className="text-text-muted normal-case tracking-normal">(optional — helps narrow results)</span>
        </label>
        <select
          id="series"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className="w-full rounded-lg bg-surface-raised border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-copper focus:border-transparent transition-all"
        >
          <option value="">Not sure / any series</option>
          {ALL_SERIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label} ({s.years})
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
          {limitData && (
            <a href={limitData.upgradeUrl} className="ml-2 underline font-medium hover:text-copper transition-colors">
              Go Pro — unlimited lookups →
            </a>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !year || !denomination}
        className="w-full rounded-lg bg-copper hover:bg-copper-light disabled:bg-surface-high disabled:text-text-muted text-background font-semibold py-3.5 text-base transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        {loading ? (
          <>
            <span className="animate-copper-pulse">●</span>
            <span>Checking the archives…</span>
          </>
        ) : (
          <>
            <span>Look It Up</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </>
        )}
      </button>
    </form>
  );
}
