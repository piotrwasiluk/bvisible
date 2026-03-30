import { GoogleGenAI } from "@google/genai";

let genaiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genaiClient) {
    genaiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });
  }
  return genaiClient;
}

/**
 * Analyze sentiment toward a brand in an AI response using Gemini flash-lite.
 * Returns a score 0-100 (0 = very negative, 50 = neutral, 100 = very positive).
 */
export async function analyzeSentiment(
  responseText: string,
  brandName: string,
): Promise<number> {
  if (!process.env.GOOGLE_API_KEY) {
    return 50; // Neutral fallback if no API key
  }

  try {
    const client = getClient();
    const truncated =
      responseText.length > 3000
        ? responseText.slice(0, 3000) + "..."
        : responseText;

    const result = await client.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: `Analyze the sentiment toward "${brandName}" in this AI-generated response.

Response text:
"""
${truncated}
"""

Return ONLY a JSON object with this exact format, no other text:
{"score": <number 0-100>, "reasoning": "<one sentence>"}

Score guide:
- 0-20: Very negative (harsh criticism, warnings against using)
- 21-40: Negative (problems highlighted, unfavorable comparison)
- 41-60: Neutral (mentioned factually, no strong opinion)
- 61-80: Positive (favorable mentions, recommended alongside others)
- 81-100: Very positive (strong endorsement, highlighted as best option)

If "${brandName}" is not mentioned, return {"score": 50, "reasoning": "Brand not mentioned in response"}.`,
    });

    const text = result.text || "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as {
        score?: number;
        reasoning?: string;
      };
      if (
        typeof parsed.score === "number" &&
        parsed.score >= 0 &&
        parsed.score <= 100
      ) {
        return Math.round(parsed.score);
      }
    }

    return 50;
  } catch (err) {
    console.error("Sentiment analysis failed:", err);
    return 50;
  }
}
