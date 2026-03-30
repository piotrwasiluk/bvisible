import type {
  ProviderCitation,
  ClassifiedCitation,
  WorkspaceContext,
} from "../types.js";

function extractDomain(url: string): string {
  try {
    return new URL(
      url.startsWith("http") ? url : `https://${url}`,
    ).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const SOCIAL_DOMAINS = new Set([
  "reddit.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "youtube.com",
  "tiktok.com",
  "instagram.com",
  "github.com",
]);

const EDUCATIONAL_DOMAINS = new Set([
  "wikipedia.org",
  "edu",
  "arxiv.org",
  "scholar.google.com",
  "researchgate.net",
]);

const NEWS_DOMAINS = new Set([
  "reuters.com",
  "bbc.com",
  "cnn.com",
  "techcrunch.com",
  "wired.com",
  "theverge.com",
  "forbes.com",
  "bloomberg.com",
]);

function classifyDomainType(
  domain: string,
  ownDomain: string,
  competitorDomains: string[],
): string {
  if (domain === ownDomain || domain.endsWith(`.${ownDomain}`)) {
    return "Owned";
  }

  for (const comp of competitorDomains) {
    if (domain === comp || domain.endsWith(`.${comp}`)) {
      return "Competitors";
    }
  }

  if (SOCIAL_DOMAINS.has(domain)) return "Social";

  for (const edu of EDUCATIONAL_DOMAINS) {
    if (domain === edu || domain.endsWith(`.${edu}`)) return "Educational";
  }

  for (const news of NEWS_DOMAINS) {
    if (domain === news || domain.endsWith(`.${news}`)) return "News";
  }

  // Default: assume it's a product/tool site
  return "Products";
}

function findCompetitorReferences(
  domain: string,
  competitorDomains: string[],
  competitorNames: string[],
): string[] {
  const refs: string[] = [];
  for (let i = 0; i < competitorDomains.length; i++) {
    if (domain === competitorDomains[i]) {
      refs.push(competitorNames[i]);
    }
  }
  return refs;
}

/**
 * Classify citations from a provider response into enriched records
 * ready for database insertion.
 */
export function classifyCitations(
  rawCitations: ProviderCitation[],
  workspace: WorkspaceContext,
): ClassifiedCitation[] {
  const ownDomain = extractDomain(workspace.websiteUrl);
  const competitorDomains = workspace.competitors
    .filter(Boolean)
    .map(extractDomain);
  const competitorNames = workspace.competitors.filter(Boolean).map((url) => {
    // Try to derive a brand name from domain
    const d = extractDomain(url);
    return d.split(".")[0].charAt(0).toUpperCase() + d.split(".")[0].slice(1);
  });

  return rawCitations.map((cit) => {
    const domain = cit.domain || extractDomain(cit.url);
    const domainType = classifyDomainType(domain, ownDomain, competitorDomains);
    const hasBrandReference = domain === ownDomain;
    const competitorRefs = findCompetitorReferences(
      domain,
      competitorDomains,
      competitorNames,
    );

    return {
      url: cit.url,
      domain,
      domainType,
      pageType: "Informational Article",
      influenceScore: Math.floor(50 + Math.random() * 40), // Placeholder until we have DA data
      domainAuthority: null,
      hasBrandReference,
      competitorReferences: competitorRefs,
    };
  });
}
