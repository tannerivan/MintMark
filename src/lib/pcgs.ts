/**
 * MintMark™ PCGS CoinFacts Photo Utility
 *
 * PCGS has no public image API. We construct photo URLs two ways:
 *
 * 1. If the AI returns a pcgsCoinId (their internal 5–6 digit coin number),
 *    we build a direct CDN image URL. This is the preferred path.
 *
 * 2. If no PCGS ID is available, we build a CoinFacts search URL that the
 *    user can click through to find the coin manually.
 *
 * PCGS CDN pattern (observed from CoinFacts pages, subject to change):
 *   https://storage.googleapis.com/pcgs-images/{pcgsCoinId}-1.jpg
 *
 * If the image 404s (PCGS changes their CDN, coin not in their database),
 * the CoinPhoto component falls back to a graceful placeholder.
 * We revisit this strategy if PCGS breaks it — per DECISIONS.md.
 */

const PCGS_IMAGE_CDN = "https://storage.googleapis.com/pcgs-images";
const PCGS_COINFACTS_BASE = "https://www.pcgs.com/coinfacts/coin/detail";
const PCGS_SEARCH_BASE = "https://www.pcgs.com/coinfacts/search";

/**
 * Build a direct PCGS CDN image URL from a PCGS coin ID.
 * Returns null if no ID is provided.
 */
export function buildPcgsImageUrl(pcgsCoinId: string | number | null | undefined): string | null {
  if (!pcgsCoinId) return null;
  return `${PCGS_IMAGE_CDN}/${pcgsCoinId}-1.jpg`;
}

/**
 * Build a PCGS CoinFacts detail page URL from a PCGS coin ID.
 */
export function buildPcgsDetailUrl(pcgsCoinId: string | number | null | undefined): string | null {
  if (!pcgsCoinId) return null;
  return `${PCGS_COINFACTS_BASE}/${pcgsCoinId}`;
}

/**
 * Build a PCGS CoinFacts search URL for a coin.
 * Used as the fallback link when we don't have the PCGS coin ID.
 */
export function buildPcgsSearchUrl({
  year,
  mintMark,
  denomination,
}: {
  year: number | string;
  mintMark?: string | null;
  denomination: string;
}): string {
  const query = [year, mintMark, denomination].filter(Boolean).join(" ");
  return `${PCGS_SEARCH_BASE}?q=${encodeURIComponent(query)}`;
}

/**
 * Build an NGC coin search URL.
 */
export function buildNgcSearchUrl({
  year,
  mintMark,
  denomination,
}: {
  year: number | string;
  mintMark?: string | null;
  denomination: string;
}): string {
  const query = [year, mintMark, denomination].filter(Boolean).join(" ");
  return `https://www.ngccoin.com/coin-explorer/search/?q=${encodeURIComponent(query)}`;
}

/**
 * Build PCGS grading submission URL with affiliate ID.
 * Affiliate ID comes from env — placeholder until account is approved.
 */
export function buildPcgsGradingUrl(): string {
  const affiliateId = process.env.PCGS_AFFILIATE_ID;
  const base = "https://www.pcgs.com/services/submission";
  return affiliateId && affiliateId !== "PLACEHOLDER"
    ? `${base}?ref=${affiliateId}`
    : base;
}

/**
 * Build NGC grading submission URL with affiliate ID.
 */
export function buildNgcGradingUrl(): string {
  const affiliateId = process.env.NGC_AFFILIATE_ID;
  const base = "https://www.ngccoin.com/submit/";
  return affiliateId && affiliateId !== "PLACEHOLDER"
    ? `${base}?ref=${affiliateId}`
    : base;
}

/**
 * All four reference links for a coin — shown at the bottom of every result.
 */
export function buildReferenceLinks({
  year,
  mintMark,
  denomination,
  pcgsCoinId,
}: {
  year: number | string;
  mintMark?: string | null;
  denomination: string;
  pcgsCoinId?: string | null;
}) {
  return {
    pcgs: pcgsCoinId
      ? buildPcgsDetailUrl(pcgsCoinId)!
      : buildPcgsSearchUrl({ year, mintMark, denomination }),
    ngc: buildNgcSearchUrl({ year, mintMark, denomination }),
    coppercoins: `https://www.coppercoins.com/lincoln/cent/${year}`,
    coneca: `https://conecaonline.org/error-variety-search/?q=${encodeURIComponent(`${year} ${mintMark || ""} ${denomination}`)}`,
  };
}
