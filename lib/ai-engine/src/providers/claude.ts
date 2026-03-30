import Anthropic from "@anthropic-ai/sdk";
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

export class ClaudeAdapter implements ProviderAdapter {
  name = "Claude";
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  isAvailable(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  async query(prompt: string): Promise<ProviderResponse> {
    const response = await this.client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 5,
        } as unknown as Anthropic.Tool,
      ],
    });

    let rawText = "";
    const citations: ProviderResponse["citations"] = [];
    const seenUrls = new Set<string>();

    for (const block of response.content) {
      if (block.type === "text") {
        rawText += block.text;

        // Check for citations in the text block
        const blockAny = block as unknown as Record<string, unknown>;
        if (Array.isArray(blockAny.citations)) {
          for (const cit of blockAny.citations) {
            const c = cit as { url?: string; title?: string };
            if (c.url && !seenUrls.has(c.url)) {
              seenUrls.add(c.url);
              citations.push({
                url: c.url,
                domain: extractDomain(c.url),
                title: c.title || undefined,
              });
            }
          }
        }
      } else if (block.type === "tool_use") {
        // The web_search tool results come back in server_tool_use / tool_result patterns
        // We extract URLs from the tool input/output if available
        const toolBlock = block as unknown as Record<string, unknown>;
        if (toolBlock.name === "web_search" && toolBlock.input) {
          // Tool use block - the results come in a subsequent content block
        }
      }
    }

    // Also try to extract URLs from the raw text using a simple regex
    // as a fallback for citations that might be inline
    const urlRegex = /https?:\/\/[^\s)\]"']+/g;
    const textUrls = rawText.match(urlRegex) || [];
    for (const url of textUrls) {
      const cleanUrl = url.replace(/[.,;:!?]+$/, "");
      if (!seenUrls.has(cleanUrl)) {
        seenUrls.add(cleanUrl);
        citations.push({
          url: cleanUrl,
          domain: extractDomain(cleanUrl),
        });
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
