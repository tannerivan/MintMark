import type { ValueRange } from "@/lib/anthropic";

interface ValueRangeProps {
  valueRange: ValueRange;
}

function formatDollar(n: number): string {
  if (n < 1) return `${Math.round(n * 100)}¢`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}

export default function ValueRangeCard({ valueRange }: ValueRangeProps) {
  const { low, mid, high, dataSourceLabel, gradeContext } = valueRange;

  return (
    <div className="space-y-4">
      {/* Three-column value display */}
      <div className="grid grid-cols-3 gap-2">
        <ValueColumn label="Low" value={low} sublabel="Heavily worn" dim />
        <ValueColumn label="Mid" value={mid} sublabel="Average circ." highlight />
        <ValueColumn label="High" value={high} sublabel="Top of circ." />
      </div>

      {/* Grade context */}
      <p className="text-xs text-text-muted capitalize">
        {gradeContext} condition · {dataSourceLabel}
      </p>

      {/* Value disclaimer — non-negotiable trust feature */}
      <p className="text-xs text-text-muted border-t border-border pt-3 leading-relaxed">
        Values estimated from historical sales data — verify current prices on{" "}
        <a
          href="https://www.pcgs.com/prices"
          target="_blank"
          rel="noopener noreferrer"
          className="text-copper hover:text-copper-light transition-colors underline-offset-2 hover:underline"
        >
          PCGS
        </a>
        ,{" "}
        <a
          href="https://www.ngccoin.com/price-guide/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-copper hover:text-copper-light transition-colors underline-offset-2 hover:underline"
        >
          NGC
        </a>
        , or{" "}
        <a
          href="https://www.ebay.com/sh/research?keywords=coin&_saleFilter=1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-copper hover:text-copper-light transition-colors underline-offset-2 hover:underline"
        >
          eBay completed sales
        </a>{" "}
        before buying or selling.
      </p>
    </div>
  );
}

function ValueColumn({
  label,
  value,
  sublabel,
  highlight,
  dim,
}: {
  label: string;
  value: number;
  sublabel: string;
  highlight?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 text-center border ${
        highlight
          ? "border-copper/40 bg-copper/5"
          : "border-border bg-surface-raised"
      }`}
    >
      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${dim ? "text-text-muted" : "text-text-secondary"}`}>
        {label}
      </div>
      <div className={`text-xl font-semibold tabular-nums ${highlight ? "text-copper" : dim ? "text-text-secondary" : "text-text"}`}>
        {formatDollar(value)}
      </div>
      <div className="text-xs text-text-muted mt-0.5">{sublabel}</div>
    </div>
  );
}
