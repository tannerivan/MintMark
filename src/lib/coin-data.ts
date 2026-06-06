/**
 * MintMark™ Static Coin Data
 *
 * Source of truth for all form dropdowns and display labels.
 * Series list is intentionally comprehensive — covers everything a beginner
 * is likely to find in circulation or in an old collection.
 */

export const DENOMINATIONS = [
  { value: "cent",       label: "Cent (Penny)" },
  { value: "nickel",     label: "Nickel" },
  { value: "dime",       label: "Dime" },
  { value: "quarter",    label: "Quarter" },
  { value: "half",       label: "Half Dollar" },
  { value: "dollar",     label: "Dollar" },
] as const;

export type Denomination = typeof DENOMINATIONS[number]["value"];

export const MINT_MARKS = [
  { value: "",   label: "None (Philadelphia, pre-1980)" },
  { value: "P",  label: "P — Philadelphia (1980–present)" },
  { value: "D",  label: "D — Denver" },
  { value: "S",  label: "S — San Francisco" },
  { value: "W",  label: "W — West Point" },
  { value: "CC", label: "CC — Carson City (historical)" },
  { value: "O",  label: "O — New Orleans (historical)" },
  { value: "C",  label: "C — Charlotte (historical, gold only)" },
] as const;

export type MintMark = typeof MINT_MARKS[number]["value"];

// Series grouped by denomination for a cleaner UX later (V1 uses flat list)
export const SERIES_BY_DENOMINATION: Record<Denomination, { value: string; label: string; years: string }[]> = {
  cent: [
    { value: "flying-eagle-cent",      label: "Flying Eagle Cent",      years: "1856–1858" },
    { value: "indian-head-cent",       label: "Indian Head Cent",        years: "1859–1909" },
    { value: "lincoln-wheat-cent",     label: "Lincoln Wheat Cent",      years: "1909–1958" },
    { value: "lincoln-memorial-cent",  label: "Lincoln Memorial Cent",   years: "1959–2008" },
    { value: "lincoln-bicentennial",   label: "Lincoln Bicentennial",    years: "2009" },
    { value: "lincoln-shield-cent",    label: "Lincoln Shield Cent",     years: "2010–present" },
  ],
  nickel: [
    { value: "shield-nickel",          label: "Shield Nickel",           years: "1866–1883" },
    { value: "liberty-head-nickel",    label: "Liberty Head Nickel",     years: "1883–1913" },
    { value: "buffalo-nickel",         label: "Buffalo (Indian Head) Nickel", years: "1913–1938" },
    { value: "jefferson-nickel",       label: "Jefferson Nickel",        years: "1938–present" },
    { value: "wartime-silver-nickel",  label: "Wartime Silver Nickel",   years: "1942–1945" },
  ],
  dime: [
    { value: "seated-liberty-dime",    label: "Seated Liberty Dime",     years: "1837–1891" },
    { value: "barber-dime",            label: "Barber Dime",             years: "1892–1916" },
    { value: "mercury-dime",           label: "Mercury (Winged Liberty) Dime", years: "1916–1945" },
    { value: "roosevelt-dime",         label: "Roosevelt Dime",          years: "1946–present" },
  ],
  quarter: [
    { value: "seated-liberty-quarter", label: "Seated Liberty Quarter",  years: "1838–1891" },
    { value: "barber-quarter",         label: "Barber Quarter",          years: "1892–1916" },
    { value: "standing-liberty-quarter", label: "Standing Liberty Quarter", years: "1916–1930" },
    { value: "washington-quarter",     label: "Washington Quarter",      years: "1932–1998" },
    { value: "50-state-quarters",      label: "50 State Quarters",       years: "1999–2008" },
    { value: "dc-territories-quarters", label: "DC & US Territories Quarters", years: "2009" },
    { value: "atb-quarters",           label: "America the Beautiful Quarters", years: "2010–2021" },
    { value: "american-women-quarters", label: "American Women Quarters",  years: "2022–2025" },
  ],
  half: [
    { value: "seated-liberty-half",    label: "Seated Liberty Half Dollar", years: "1839–1891" },
    { value: "barber-half",            label: "Barber Half Dollar",       years: "1892–1915" },
    { value: "walking-liberty-half",   label: "Walking Liberty Half Dollar", years: "1916–1947" },
    { value: "franklin-half",          label: "Franklin Half Dollar",     years: "1948–1963" },
    { value: "kennedy-half",           label: "Kennedy Half Dollar",      years: "1964–present" },
  ],
  dollar: [
    { value: "seated-liberty-dollar",  label: "Seated Liberty Dollar",   years: "1840–1873" },
    { value: "trade-dollar",           label: "Trade Dollar",             years: "1873–1885" },
    { value: "morgan-dollar",          label: "Morgan Dollar",            years: "1878–1921" },
    { value: "peace-dollar",           label: "Peace Dollar",             years: "1921–1935" },
    { value: "eisenhower-dollar",      label: "Eisenhower Dollar",        years: "1971–1978" },
    { value: "susan-b-anthony-dollar", label: "Susan B. Anthony Dollar",  years: "1979–1999" },
    { value: "sacagawea-dollar",       label: "Sacagawea Dollar",         years: "2000–present" },
    { value: "presidential-dollar",    label: "Presidential Dollar",      years: "2007–2016" },
    { value: "american-innovation-dollar", label: "American Innovation Dollar", years: "2018–present" },
  ],
};

// Flat list for the search form series dropdown
export const ALL_SERIES = Object.values(SERIES_BY_DENOMINATION).flat();

// Human-readable label helpers
export function getDenominationLabel(value: string): string {
  return DENOMINATIONS.find((d) => d.value === value)?.label ?? value;
}

export function getMintMarkLabel(value: string): string {
  return MINT_MARKS.find((m) => m.value === value)?.label ?? value;
}

export function getSeriesLabel(value: string): string {
  return ALL_SERIES.find((s) => s.value === value)?.label ?? value;
}

// Display string for a coin identity — used in results header
export function formatCoinIdentity({
  year,
  mintMark,
  denomination,
  series,
}: {
  year: number | string;
  mintMark?: string | null;
  denomination: string;
  series?: string | null;
}): string {
  const mm = mintMark ? `-${mintMark}` : "";
  const denom = getDenominationLabel(denomination);
  const ser = series ? ` (${getSeriesLabel(series)})` : "";
  return `${year}${mm} ${denom}${ser}`;
}
