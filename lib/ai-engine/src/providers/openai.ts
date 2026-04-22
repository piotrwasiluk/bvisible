import OpenAI from "openai";
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

export class OpenAIAdapter implements ProviderAdapter {
  name = "ChatGPT";
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  async query(prompt: string): Promise<ProviderResponse> {
    const response = await this.client.responses.create({
      model: "gpt-5.4-mini",
      input: prompt,
      tools: [{ type: "web_search_preview" as const }],
    });

    let rawText = "";
    const citations: ProviderResponse["citations"] = [];
    const seenUrls = new Set<string>();

    // Extract text and citations from the response output
    for (const item of response.output) {
      if (item.type === "message") {
        for (const block of item.content) {
          if (block.type === "output_text") {
            rawText += block.text;
            // Extract URL citations from annotations
            if (block.annotations) {
              for (const ann of block.annotations) {
                if (ann.type === "url_citation" && !seenUrls.has(ann.url)) {
                  seenUrls.add(ann.url);
                  citations.push({
                    url: ann.url,
                    domain: extractDomain(ann.url),
                    title: ann.title || undefined,
                  });
                }
              }
            }
          }
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
