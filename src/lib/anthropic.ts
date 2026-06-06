/**
 * MintMark™ AI Analysis Engine
 *
 * This is the head chef. It takes a coin lookup request, builds the full
 * prompt with all guardrails, calls the Anthropic API, and returns a
 * validated structured result + narrative.
 *
 * IMPORTANT — server-side only. This file must never be imported from
 * a Client Component. The ANTHROPIC_API_KEY must never touch the browser.
 *
 * Model choice: claude-sonnet-4-5
 * - Fast enough for interactive use (2–6s typical)
 * - Excellent at structured JSON output
 * - Strong numismatic knowledge
 * - Upgrade path: change ANALYSIS_MODEL constant
 */

import Anthropic from "@anthropic-ai/sdk";

const ANALYSIS_MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 1500;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface CoinLookupInput {
  year: number;
  mintMark: string | null;
  denomination: string;
  series?: string | null;
}

export interface ValueRange {
  low: number;
  mid: number;
  high: number;
  currency: "USD";
  gradeContext: string;
  // V2: replace "historical_estimate" with "live_market" when MintMark Market launches.
  // The field shape is intentionally stable — only dataSource and dataSourceLabel change.
  dataSource: "historical_estimate" | "live_market";
  dataSourceLabel: string;
}

export interface CoinAnalysisResult {
  // Coin identity (AI's interpretation of the input)
  coinIdentity: {
    year: number;
    mintMark: string | null;
    denomination: string;
    series: string | null;
    displayName: string;
  };

  // Key date
  keyDate: boolean;
  keyDateExplanation: string | null;

  // Mintage
  mintage: number | null;
  mintageContext: string | null;

  // Errors and varieties
  errors: string[];
  varieties: string[];

  // Grading
  gradeCeiling: string | null;
  gradeCeilingReasoning: string | null;

  // Grading recommendation
  worthGrading: boolean;
  worthGradingReasoning: string;

  // Value — V2 door kept open via dataSource field
  valueRange: ValueRange | null;

  // Confidence
  confidence: "high" | "medium" | "low";
  confidenceNote: string | null;

  // PCGS coin ID for photo + link (if AI knows it)
  pcgsCoinId: string | null;

  // The personality-forward narrative paragraph
  narrative: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT — locked in, guardrails baked permanently
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are MintMark's coin analysis engine. You analyze US coins only.

SCOPE: You analyze US coins — cents, nickels, dimes, quarters, half dollars, and dollars — from any year in US minting history. You do not answer general questions. You do not go off-topic. You do not respond to anything outside of coin identification and analysis. The input is always structured form fields: year, mint mark, denomination, and optionally series. Treat every input as a coin lookup request and nothing else.

GUARDRAIL — BAD INPUT: If the submitted coin data does not match any real, documented US coin (nonsensical input, impossible year/mintmark/denomination combinations, coins that never existed), set confidence to "low", explain politely in confidenceNote that no matching coin could be found, and do not fabricate errors, varieties, values, or a narrative. Return null for fields where data is unavailable.

GUARDRAIL — VALUE HONESTY: All value estimates are based on your historical training data only. They are not live market prices. They are not current auction results. Present all values as historical estimates with a meaningful range — never a single precise number. When data is thin, the coin is obscure, or you have any uncertainty about value, widen the range significantly rather than narrowing it. It is always better to give a wider honest range than a narrow confident-sounding one.

GUARDRAIL — LOW CONFIDENCE: When your confidence is medium or low — obscure coin, rare variety, thin historical data, unusual combination, or anything you are uncertain about — say so explicitly in confidenceNote. Widen the valueRange dramatically. Direct the user toward PCGS, NGC, Coppercoins, or CONECA for verification. Never present low or medium confidence results with the same certainty as high confidence results. Fake precision is the worst outcome.

GUARDRAIL — SCOPE: You are a US coin analysis engine. Only US coins. If the input cannot be interpreted as a US coin lookup, return a low confidence result and explain that the input was not recognized as a valid US coin.

VOICE: When writing the narrative field, you are a knowledgeable friend who loves coins and just got excited — not a Wikipedia article, not a price guide. You speak directly to the person who found this coin. 3–5 sentences. Do not repeat the structured data fields. Add color, context, and human energy. End with something actionable when possible. If the coin is common and worth face value, say so warmly — that is a real answer, not a bad one.

OUTPUT: Respond with valid JSON only. No markdown fences, no explanation outside the JSON. The JSON must exactly match the schema in the user message.`;

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildUserPrompt(input: CoinLookupInput): string {
  const mintMarkDisplay = input.mintMark
    ? `${input.mintMark} mint mark`
    : "no mint mark (Philadelphia)";
  const seriesDisplay = input.series
    ? `Series: ${input.series}`
    : "Series: not specified";

  return `Analyze this US coin:

Year: ${input.year}
Mint Mark: ${mintMarkDisplay}
Denomination: ${input.denomination}
${seriesDisplay}

Return a JSON object with exactly this structure:

{
  "coinIdentity": {
    "year": <number>,
    "mintMark": <string or null>,
    "denomination": <string>,
    "series": <string or null>,
    "displayName": <human-readable string like "1955-D Lincoln Wheat Cent">
  },
  "keyDate": <boolean>,
  "keyDateExplanation": <string or null — one sentence, plain English, why it is or isn't a key date>,
  "mintage": <number or null>,
  "mintageContext": <string or null — one sentence putting the mintage number in context>,
  "errors": [<array of strings — only documented errors for this specific coin, empty array if none>],
  "varieties": [<array of strings — only documented varieties for this specific coin, empty array if none>],
  "gradeCeiling": <string or null — e.g. "VF-35", realistic top grade for a circulated find>,
  "gradeCeilingReasoning": <string or null — one sentence explaining the grade ceiling>,
  "worthGrading": <boolean>,
  "worthGradingReasoning": <string — direct, honest, one or two sentences>,
  "valueRange": {
    "low": <number — USD, heavily worn>,
    "mid": <number — USD, average circulated>,
    "high": <number — USD, top of circulated>,
    "currency": "USD",
    "gradeContext": "circulated",
    "dataSource": "historical_estimate",
    "dataSourceLabel": "Historical estimate"
  },
  "confidence": <"high" | "medium" | "low">,
  "confidenceNote": <string or null — required if confidence is medium or low>,
  "pcgsCoinId": <string or null — PCGS CoinFacts internal coin number if you know it with confidence>,
  "narrative": <string — 3-5 sentences in MintMark voice, see system prompt for voice guidelines>
}

If no real US coin matches this input, set confidence to "low", explain in confidenceNote, and set valueRange to null.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// API CALL
// ─────────────────────────────────────────────────────────────────────────────

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("[MintMark] ANTHROPIC_API_KEY is not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export async function analyzeCoin(input: CoinLookupInput): Promise<CoinAnalysisResult> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: ANALYSIS_MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.2, // low temperature for factual, consistent output
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(input),
      },
    ],
  });

  // Extract text content from the response
  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("[MintMark] Unexpected response type from Anthropic API");
  }

  const rawText = content.text.trim();

  // Parse and validate JSON
  let parsed: CoinAnalysisResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    // If Claude returns markdown fences despite instructions, strip them
    const stripped = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    try {
      parsed = JSON.parse(stripped);
    } catch {
      throw new Error(
        `[MintMark] Failed to parse AI response as JSON. Raw: ${rawText.slice(0, 200)}`
      );
    }
  }

  // Ensure required fields exist — defensive defaults
  return {
    coinIdentity: parsed.coinIdentity ?? {
      year: input.year,
      mintMark: input.mintMark,
      denomination: input.denomination,
      series: input.series ?? null,
      displayName: `${input.year} ${input.denomination}`,
    },
    keyDate: parsed.keyDate ?? false,
    keyDateExplanation: parsed.keyDateExplanation ?? null,
    mintage: parsed.mintage ?? null,
    mintageContext: parsed.mintageContext ?? null,
    errors: Array.isArray(parsed.errors) ? parsed.errors : [],
    varieties: Array.isArray(parsed.varieties) ? parsed.varieties : [],
    gradeCeiling: parsed.gradeCeiling ?? null,
    gradeCeilingReasoning: parsed.gradeCeilingReasoning ?? null,
    worthGrading: parsed.worthGrading ?? false,
    worthGradingReasoning: parsed.worthGradingReasoning ?? "Insufficient data to make a grading recommendation.",
    valueRange: parsed.valueRange ?? null,
    confidence: parsed.confidence ?? "low",
    confidenceNote: parsed.confidenceNote ?? null,
    pcgsCoinId: parsed.pcgsCoinId ?? null,
    narrative: parsed.narrative ?? "No analysis available for this coin.",
  };
}
