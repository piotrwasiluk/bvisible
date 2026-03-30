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

interface PerplexityChoice {
  message: {
    role: string;
    content: string;
  };
}

interface PerplexityResponse {
  choices: PerplexityChoice[];
  citations?: string[];
}

export class PerplexityAdapter implements ProviderAdapter {
  name = "Perplexity";

  isAvailable(): boolean {
    return !!process.env.PERPLEXITY_API_KEY;
  }

  async query(prompt: string): Promise<ProviderResponse> {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [{ role: "user", content: prompt }],
        return_citations: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Perplexity API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as PerplexityResponse;
    const rawText = data.choices?.[0]?.message?.content || "";

    const citations: ProviderResponse["citations"] = [];
    const seenUrls = new Set<string>();

    if (data.citations) {
      for (const url of data.citations) {
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          citations.push({
            url,
            domain: extractDomain(url),
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
