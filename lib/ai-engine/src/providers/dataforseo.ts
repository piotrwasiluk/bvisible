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

interface DataForSEOReference {
  source?: string;
  domain?: string;
  url?: string;
  title?: string;
  text?: string;
}

interface DataForSEOItem {
  type: string;
  markdown?: string;
  references?: DataForSEOReference[];
}

interface DataForSEOResult {
  keyword: string;
  items?: DataForSEOItem[];
}

interface DataForSEOTask {
  result?: DataForSEOResult[];
}

interface DataForSEOResponse {
  tasks?: DataForSEOTask[];
}

export class DataForSEOAdapter implements ProviderAdapter {
  name = "Google AI Mode";

  isAvailable(): boolean {
    return !!process.env.DATAFORSEO_LOGIN && !!process.env.DATAFORSEO_PASSWORD;
  }

  async query(prompt: string): Promise<ProviderResponse> {
    const credentials = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`,
    ).toString("base64");

    const res = await fetch(
      "https://api.dataforseo.com/v3/serp/google/ai_mode/live/advanced",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify([
          {
            keyword: prompt,
            location_code: 2840, // United States
            language_code: "en",
          },
        ]),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DataForSEO API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as DataForSEOResponse;

    const task = data.tasks?.[0];
    const result = task?.result?.[0];
    const items = result?.items || [];

    let rawText = "";
    const citations: ProviderResponse["citations"] = [];
    const seenUrls = new Set<string>();

    for (const item of items) {
      if (item.type === "ai_overview" && item.markdown) {
        rawText += item.markdown;
      }

      if (item.references) {
        for (const ref of item.references) {
          if (ref.url && !seenUrls.has(ref.url)) {
            seenUrls.add(ref.url);
            citations.push({
              url: ref.url,
              domain: ref.domain || extractDomain(ref.url),
              title: ref.title || undefined,
            });
          }
        }
      }
    }

    // If no AI overview found, check for other item types with text
    if (!rawText) {
      for (const item of items) {
        if (item.markdown) {
          rawText += item.markdown + "\n";
        }
      }
    }

    return {
      platform: this.name,
      rawText: rawText.trim(),
      citations,
      executedAt: new Date(),
    };
  }
}
