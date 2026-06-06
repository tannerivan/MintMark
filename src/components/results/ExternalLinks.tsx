import { buildReferenceLinks, buildPcgsGradingUrl, buildNgcGradingUrl } from "@/lib/pcgs";

interface ExternalLinksProps {
  year: number;
  mintMark: string | null;
  denomination: string;
  pcgsCoinId: string | null;
  worthGrading: boolean;
}

export default function ExternalLinks({
  year,
  mintMark,
  denomination,
  pcgsCoinId,
  worthGrading,
}: ExternalLinksProps) {
  const links = buildReferenceLinks({ year, mintMark, denomination, pcgsCoinId });

  return (
    <div className="space-y-3">
      {/* Reference links */}
      <div className="grid grid-cols-2 gap-2">
        <ReferenceLink href={links.pcgs} label="PCGS CoinFacts" description="Photos, populations, prices" />
        <ReferenceLink href={links.ngc} label="NGC Coin Explorer" description="Certified populations, values" />
        <ReferenceLink href={links.coppercoins} label="CopperCoins" description="Lincoln cent varieties" />
        <ReferenceLink href={links.coneca} label="CONECA" description="Error & variety registry" />
      </div>

      {/* Grading submission links — shown prominently when worthGrading is true */}
      {worthGrading && (
        <div className="rounded-lg border border-copper/30 bg-copper/5 p-3 space-y-2">
          <p className="text-xs font-medium text-copper uppercase tracking-wider">Submit for Grading</p>
          <div className="grid grid-cols-2 gap-2">
            <GradingLink href={buildPcgsGradingUrl()} label="Grade with PCGS" />
            <GradingLink href={buildNgcGradingUrl()} label="Grade with NGC" />
          </div>
        </div>
      )}
    </div>
  );
}

function ReferenceLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-lg border border-border bg-surface-raised px-3 py-2.5 hover:border-copper/50 hover:bg-surface-high transition-all duration-200 group"
    >
      <span className="text-sm font-medium text-text group-hover:text-copper transition-colors">
        {label}
      </span>
      <span className="text-xs text-text-muted mt-0.5">{description}</span>
    </a>
  );
}

function GradingLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center rounded-lg border border-copper/40 bg-copper/10 px-3 py-2 text-sm font-medium text-copper hover:bg-copper/20 transition-all duration-200"
    >
      {label} →
    </a>
  );
}
