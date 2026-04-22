/**
 * Token-bucket rate limiter with concurrency control.
 * Ensures we don't exceed a provider's RPM limit while
 * allowing maximum parallelism within that limit.
 */
export class RateLimiter {
  private readonly maxPerMinute: number;
  private readonly maxConcurrent: number;
  private timestamps: number[] = [];
  private active = 0;
  private waiting: Array<() => void> = [];

  constructor(maxPerMinute: number, maxConcurrent: number) {
    this.maxPerMinute = maxPerMinute;
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Acquire a slot. Resolves when it's safe to make a request.
   * Respects both RPM and concurrency limits.
   */
  async acquire(): Promise<void> {
    // Wait for concurrency slot
    while (this.active >= this.maxConcurrent) {
      await new Promise<void>((resolve) => {
        this.waiting.push(resolve);
      });
    }

    // Wait for rate limit slot
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < 60_000);

    if (this.timestamps.length >= this.maxPerMinute) {
      const oldest = this.timestamps[0];
      const waitMs = 60_000 - (now - oldest) + 50; // +50ms buffer
      await new Promise<void>((resolve) => setTimeout(resolve, waitMs));
      this.timestamps = this.timestamps.filter((t) => Date.now() - t < 60_000);
    }

    this.active++;
    this.timestamps.push(Date.now());
  }

  /**
   * Release a slot after request completes.
   */
  release(): void {
    this.active--;
    const next = this.waiting.shift();
    if (next) next();
  }

  /**
   * Execute a function within rate limits.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

/**
 * Default rate limits per provider (requests per minute).
 * These are conservative defaults for base API tiers.
 * Override via environment variables: OPENAI_RPM, GEMINI_RPM, etc.
 */
export function getProviderRateLimit(provider: string): {
  rpm: number;
  concurrency: number;
} {
  const envKey = `${provider.toUpperCase().replace(/\s+/g, "_")}_RPM`;
  const envRpm = process.env[envKey];

  const defaults: Record<string, { rpm: number; concurrency: number }> = {
    ChatGPT: { rpm: 400, concurrency: 20 },
    Gemini: { rpm: 1500, concurrency: 30 },
    Perplexity: { rpm: 40, concurrency: 5 },
    "Google AI Mode": { rpm: 1500, concurrency: 30 },
  };

  const def = defaults[provider] || { rpm: 30, concurrency: 5 };

  return {
    rpm: envRpm ? parseInt(envRpm, 10) : def.rpm,
    concurrency: def.concurrency,
  };
}
