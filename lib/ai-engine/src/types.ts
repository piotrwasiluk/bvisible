export interface ProviderCitation {
  url: string;
  domain: string;
  title?: string;
}

export interface ProviderResponse {
  platform: string;
  rawText: string;
  citations: ProviderCitation[];
  executedAt: Date;
}

export interface ProviderAdapter {
  name: string;
  isAvailable(): boolean;
  query(prompt: string): Promise<ProviderResponse>;
}

export interface MentionResult {
  brandName: string;
  isOwnBrand: boolean;
  position: number;
}

export interface ClassifiedCitation {
  url: string;
  domain: string;
  domainType: string;
  pageType: string | null;
  influenceScore: number;
  domainAuthority: number | null;
  hasBrandReference: boolean;
  competitorReferences: string[];
}

export interface WorkspaceContext {
  id: number;
  brandName: string;
  websiteUrl: string;
  competitors: string[];
  region: string;
}
