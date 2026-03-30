import type { MentionResult } from "../types.js";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildWordBoundaryRegex(name: string): RegExp {
  return new RegExp(`\\b${escapeRegex(name)}\\b`, "i");
}

/**
 * Split text into sentences for position tracking.
 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|[\n\r]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Extract brand and competitor mentions from AI response text.
 * Returns one MentionResult per unique brand found, with the position
 * being the 1-indexed sentence where the brand first appears.
 */
export function extractMentions(
  text: string,
  ownBrandName: string,
  competitorNames: string[],
): MentionResult[] {
  const sentences = splitSentences(text);
  const results: MentionResult[] = [];

  // Check own brand
  const ownRegex = buildWordBoundaryRegex(ownBrandName);
  for (let i = 0; i < sentences.length; i++) {
    if (ownRegex.test(sentences[i])) {
      results.push({
        brandName: ownBrandName,
        isOwnBrand: true,
        position: i + 1,
      });
      break;
    }
  }

  // Check each competitor
  for (const comp of competitorNames) {
    if (!comp) continue;
    const compRegex = buildWordBoundaryRegex(comp);
    for (let i = 0; i < sentences.length; i++) {
      if (compRegex.test(sentences[i])) {
        results.push({
          brandName: comp,
          isOwnBrand: false,
          position: i + 1,
        });
        break;
      }
    }
  }

  return results;
}
