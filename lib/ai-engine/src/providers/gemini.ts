import { GoogleGenAI } from "@google/genai";
import type { ProviderAdapter, ProviderResponse } from "../types.js";

function extractDomain(url: string): string {
  try {
    return new URL(
      url.startsWith("http") ? url : `https://${url}`,
    ).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export class GeminiAdapter implements ProviderAdapter {
  name = "Gemini";
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });
  }

  isAvailable(): boolean {
    return !!process.env.GOOGLE_API_KEY;
  }

  async query(prompt: string): Promise<ProviderResponse> {
    const response = await this.client.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || "";
    const citations: ProviderResponse["citations"] = [];
    const seenUrls = new Set<string>();

    // Extract grounding metadata citations
    const candidate = response.candidates?.[0];
    const groundingMeta = candidate?.groundingMetadata;

    if (groundingMeta?.groundingChunks) {
      for (const chunk of groundingMeta.groundingChunks) {
        const web = chunk.web;
        if (web?.uri && !seenUrls.has(web.uri)) {
          seenUrls.add(web.uri);
          citations.push({
            url: web.uri,
            domain: extractDomain(web.uri),
            title: web.title || undefined,
          });
        }
      }
    }

    return {
      platform: this.name,
      rawText,
      citations,
      executedAt: new Date(),
    };
  }
}
