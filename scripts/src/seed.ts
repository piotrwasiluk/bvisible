import { db } from "@workspace/db";
import {
  workspacesTable,
  topicsTable,
  promptsTable,
  promptExecutionsTable,
  mentionsTable,
  citationsTable,
  pagesTable,
  sentimentThemesTable,
  reportsTable,
  dailyMetricsTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const PLATFORMS = [
  "Google AI Mode",
  "Google AI Overview",
  "Gemini",
  "ChatGPT",
  "Perplexity",
] as const;

const COMPETITORS = [
  "Machine Metrics",
  "Vorne",
  "Augury",
  "Inductive Automation",
  "Asset Watch",
] as const;

const COMPETITOR_DOMAINS = [
  "machinemetrics.com",
  "vorne.com",
  "augury.com",
  "inductiveautomation.com",
  "assetwatch.com",
] as const;

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding database...");

  // Clear existing data (order matters for FK constraints)
  await db.delete(dailyMetricsTable);
  await db.delete(citationsTable);
  await db.delete(mentionsTable);
  await db.delete(promptExecutionsTable);
  await db.delete(sentimentThemesTable);
  await db.delete(reportsTable);
  await db.delete(pagesTable);
  await db.delete(promptsTable);
  await db.delete(topicsTable);
  console.log("  Cleared existing data");

  // Get or create workspace
  const existingWs = await db.select().from(workspacesTable).limit(1);
  let workspaceId: number;
  if (existingWs.length > 0) {
    workspaceId = existingWs[0].id;
    console.log(`  Using existing workspace id=${workspaceId}`);
  } else {
    const [ws] = await db
      .insert(workspacesTable)
      .values({
        brandName: "Guidewheel",
        websiteUrl: "https://www.guidewheel.com",
        competitor1Url: "https://www.machinemetrics.com",
        competitor2Url: "https://www.vorne.com",
        competitor3Url: "https://www.augury.com",
        region: "us-en",
        productCategories: "Machine Monitoring, OEE, Downtime Tracking",
      })
      .returning();
    workspaceId = ws.id;
    console.log(`  Created workspace id=${workspaceId}`);
  }

  // ── Topics ───────────────────────────────────────────────────────────────

  const topicData = [
    { name: "Automation, IIoT & AI Platforms", color: "blue" },
    { name: "Energy & Cost Analytics", color: "amber" },
    { name: "Frontline Execution & Coaching", color: "purple" },
    { name: "Lean Waste & Continuous Improvement", color: "amber" },
    { name: "Machine & Downtime Monitoring", color: "emerald" },
    { name: "OT-Free Connectivity & Installation", color: "teal" },
  ];

  const topics = await db
    .insert(topicsTable)
    .values(topicData.map((t) => ({ ...t, workspaceId })))
    .returning();
  console.log(`  Created ${topics.length} topics`);

  // ── Prompts ──────────────────────────────────────────────────────────────

  const promptData = [
    {
      text: "What's the difference between an IIoT platform and an MES?",
      topicIdx: 0,
      fanout: 10,
      volume: 320,
    },
    {
      text: "How do I monitor machine uptime without connecting to the PLC?",
      topicIdx: 0,
      fanout: 14,
      volume: 890,
    },
    {
      text: "What's the best way to roll out machine monitoring across multiple plants?",
      topicIdx: 0,
      fanout: 10,
      volume: 540,
    },
    {
      text: "What's the best tool to track downtime automatically on older machines?",
      topicIdx: 4,
      fanout: 10,
      volume: 1200,
    },
    {
      text: "Why is my current sensor data showing the machine running when it's idle?",
      topicIdx: 4,
      fanout: 8,
      volume: 210,
    },
    {
      text: "How do I set up automatic run/stop detection from motor current?",
      topicIdx: 5,
      fanout: 11,
      volume: 380,
    },
    {
      text: "What's better: edge processing or cloud processing for shop floor data?",
      topicIdx: 0,
      fanout: 12,
      volume: 670,
    },
    {
      text: "How can I get real-time OEE without manual operator input?",
      topicIdx: 3,
      fanout: 13,
      volume: 950,
    },
    {
      text: "What's the best practice for tagging downtime reasons on the floor?",
      topicIdx: 3,
      fanout: 13,
      volume: 430,
    },
    {
      text: "How do I integrate machine monitoring data with our ERP?",
      topicIdx: 0,
      fanout: 14,
      volume: 520,
    },
    {
      text: "Which vendor is best for plug-and-play machine monitoring with no IT?",
      topicIdx: 5,
      fanout: 14,
      volume: 780,
    },
    {
      text: "Best IIoT platforms for discrete manufacturing",
      topicIdx: 0,
      fanout: 10,
      volume: 1100,
    },
    {
      text: "How to calculate true cost of downtime per hour",
      topicIdx: 1,
      fanout: 12,
      volume: 1500,
    },
    {
      text: "Edge vs cloud for real-time production monitoring",
      topicIdx: 0,
      fanout: 11,
      volume: 720,
    },
    {
      text: "MES alternatives for small manufacturers",
      topicIdx: 0,
      fanout: 10,
      volume: 850,
    },
    {
      text: "How to track OEE across multiple plant locations",
      topicIdx: 3,
      fanout: 13,
      volume: 990,
    },
    {
      text: "What is non-invasive machine monitoring?",
      topicIdx: 5,
      fanout: 10,
      volume: 640,
    },
    {
      text: "How to reduce changeover time on production lines",
      topicIdx: 3,
      fanout: 11,
      volume: 1300,
    },
    {
      text: "Best predictive maintenance software for manufacturing",
      topicIdx: 4,
      fanout: 14,
      volume: 1800,
    },
    {
      text: "How to monitor energy consumption per machine",
      topicIdx: 1,
      fanout: 12,
      volume: 870,
    },
    {
      text: "What causes micro-stops in manufacturing?",
      topicIdx: 4,
      fanout: 9,
      volume: 450,
    },
    {
      text: "How to get visibility into legacy machine performance",
      topicIdx: 5,
      fanout: 11,
      volume: 560,
    },
    {
      text: "OEE benchmarks by industry",
      topicIdx: 3,
      fanout: 10,
      volume: 2100,
    },
    {
      text: "How to reduce unplanned downtime in discrete manufacturing",
      topicIdx: 4,
      fanout: 13,
      volume: 1400,
    },
    {
      text: "What is the ROI of machine monitoring?",
      topicIdx: 1,
      fanout: 12,
      volume: 920,
    },
    {
      text: "How to coach operators using machine data",
      topicIdx: 2,
      fanout: 10,
      volume: 340,
    },
    {
      text: "Best practices for frontline worker engagement with data",
      topicIdx: 2,
      fanout: 11,
      volume: 290,
    },
    {
      text: "How to implement a continuous improvement program",
      topicIdx: 3,
      fanout: 14,
      volume: 1600,
    },
    {
      text: "How does current sensing work for machine monitoring?",
      topicIdx: 5,
      fanout: 10,
      volume: 410,
    },
    {
      text: "What are the alternatives to MES for SMB manufacturers?",
      topicIdx: 0,
      fanout: 12,
      volume: 760,
    },
    {
      text: "How to track waste reduction in lean manufacturing",
      topicIdx: 3,
      fanout: 11,
      volume: 680,
    },
    {
      text: "What IoT sensors are best for monitoring CNC machines?",
      topicIdx: 4,
      fanout: 13,
      volume: 590,
    },
    {
      text: "How to standardize shift performance across plants",
      topicIdx: 2,
      fanout: 12,
      volume: 370,
    },
    {
      text: "Top OEE software solutions 2026",
      topicIdx: 3,
      fanout: 10,
      volume: 2500,
    },
    {
      text: "How to retrofit older machines with IoT monitoring",
      topicIdx: 5,
      fanout: 14,
      volume: 830,
    },
    {
      text: "What is AI-driven predictive maintenance?",
      topicIdx: 0,
      fanout: 11,
      volume: 1100,
    },
    {
      text: "How to measure overall equipment effectiveness accurately",
      topicIdx: 3,
      fanout: 13,
      volume: 1700,
    },
    {
      text: "Best production monitoring platforms for food manufacturing",
      topicIdx: 4,
      fanout: 10,
      volume: 480,
    },
    {
      text: "How to use machine learning for downtime prediction",
      topicIdx: 0,
      fanout: 12,
      volume: 620,
    },
    {
      text: "Manufacturing analytics tools compared",
      topicIdx: 1,
      fanout: 14,
      volume: 940,
    },
    {
      text: "How to reduce energy costs in manufacturing plants",
      topicIdx: 1,
      fanout: 11,
      volume: 1050,
    },
    {
      text: "How to build a digital factory dashboard",
      topicIdx: 0,
      fanout: 13,
      volume: 730,
    },
    {
      text: "Extrusion monitoring systems comparison",
      topicIdx: 4,
      fanout: 10,
      volume: 320,
    },
    {
      text: "How to track production line efficiency in real-time",
      topicIdx: 4,
      fanout: 12,
      volume: 1150,
    },
    {
      text: "What is motor current signature analysis?",
      topicIdx: 5,
      fanout: 9,
      volume: 280,
    },
    {
      text: "How to empower floor operators with data visibility",
      topicIdx: 2,
      fanout: 11,
      volume: 310,
    },
    {
      text: "Industrial energy monitoring systems comparison",
      topicIdx: 1,
      fanout: 10,
      volume: 520,
    },
    {
      text: "How to justify investment in machine monitoring to leadership",
      topicIdx: 1,
      fanout: 13,
      volume: 680,
    },
    {
      text: "Best downtime tracking software for discrete manufacturing",
      topicIdx: 4,
      fanout: 14,
      volume: 1350,
    },
    {
      text: "How to monitor production across multiple factory sites",
      topicIdx: 4,
      fanout: 12,
      volume: 770,
    },
  ];

  const prompts = await db
    .insert(promptsTable)
    .values(
      promptData.map((p) => ({
        workspaceId,
        topicId: topics[p.topicIdx].id,
        text: p.text,
        type: "Category Related",
        tags: [topics[p.topicIdx].color],
        fanoutCount: p.fanout,
        searchVolume: p.volume,
      })),
    )
    .returning();
  console.log(`  Created ${prompts.length} prompts`);

  // ── Prompt Executions + Mentions + Citations ─────────────────────────────

  const citedDomains = [
    {
      domain: "guidewheel.com",
      type: "Owned",
      da: 29,
      brandRef: true,
      competitors: [] as string[],
    },
    {
      domain: "machinemetrics.com",
      type: "Competitors",
      da: 45,
      brandRef: false,
      competitors: ["Machine Metrics"],
    },
    {
      domain: "vorne.com",
      type: "Competitors",
      da: 35,
      brandRef: false,
      competitors: ["Vorne"],
    },
    {
      domain: "reddit.com",
      type: "Social",
      da: 99,
      brandRef: false,
      competitors: [],
    },
    {
      domain: "youtube.com",
      type: "Social",
      da: 100,
      brandRef: false,
      competitors: [],
    },
    {
      domain: "linkedin.com",
      type: "Social",
      da: 98,
      brandRef: false,
      competitors: [],
    },
    {
      domain: "tractian.com",
      type: "Products",
      da: 42,
      brandRef: false,
      competitors: [],
    },
    {
      domain: "getmaintainx.com",
      type: "Products",
      da: 61,
      brandRef: false,
      competitors: [],
    },
    {
      domain: "fabrico.io",
      type: "Products",
      da: 28,
      brandRef: false,
      competitors: ["Machine Metrics", "Vorne"],
    },
    {
      domain: "makula.io",
      type: "Products",
      da: 20,
      brandRef: false,
      competitors: [],
    },
    {
      domain: "oee.com",
      type: "Educational",
      da: 37,
      brandRef: false,
      competitors: ["Vorne"],
    },
    {
      domain: "inductiveautomation.com",
      type: "Competitors",
      da: 52,
      brandRef: false,
      competitors: ["Inductive Automation"],
    },
    {
      domain: "augury.com",
      type: "Competitors",
      da: 38,
      brandRef: false,
      competitors: ["Augury"],
    },
    {
      domain: "assetwatch.com",
      type: "Competitors",
      da: 25,
      brandRef: false,
      competitors: ["Asset Watch"],
    },
  ];

  const citedUrls = [
    "guidewheel.com/blog/machine-downtime-monitoring",
    "guidewheel.com/blog/automated-downtime-tracking",
    "guidewheel.com/blog/predictive-maintenance-roi-2026",
    "tractian.com/en/blog/machine-downtime-tracking",
    "getmaintainx.com/blog/downtime-tracking",
    "vorne.com/solutions/use-cases/reduce-down-time/optimizing",
    "fabrico.io/blog/best-production-downtime-tracking-software",
    "makula.io/blog/production-downtime-tracking",
    "oee.com/faq/",
    "reddit.com/r/PLC/comments/downtime_tracking_how_do_you_do_it",
    "reddit.com/r/PLC/comments/how_to_acquire_machine_data_for_oee_without",
    "reddit.com/r/arduino/comments/current_sensor_value_fluctuating_oddly",
    "reddit.com/r/AskEngineers/comments/how_can_i_measure_energy_per_machine",
    "reddit.com/r/LeanManufacturing/comments/from_a_lean_perspective",
    "youtube.com/watch?v=machine-monitoring-guide",
    "linkedin.com/pulse/iiot-platforms-manufacturing-2026",
    "machinemetrics.com/blog/oee-calculation",
    "machinemetrics.com/blog/downtime-tracking",
    "inductiveautomation.com/resources/article/what-is-iiot",
    "augury.com/blog/predictive-maintenance-fundamentals",
  ];

  const subreddits = [
    "r/PLC",
    "r/homelab",
    "r/networking",
    "r/devops",
    "r/IOT",
    "r/manufacturing",
  ];

  let execCount = 0;
  let mentionCount = 0;
  let citationCount = 0;

  // Generate executions for last 90 days, batching for performance
  const execBatch: Array<{
    workspaceId: number;
    promptId: number;
    platform: string;
    region: string;
    executedAt: Date;
  }> = [];

  for (let day = 90; day >= 1; day--) {
    const execDate = daysAgo(day);
    // Run ~8-12 random prompts per day across platforms
    const promptsPerDay = randomInt(8, 12);
    for (let p = 0; p < promptsPerDay; p++) {
      const prompt = prompts[randomInt(0, prompts.length - 1)];
      const platform = PLATFORMS[randomInt(0, PLATFORMS.length - 1)];
      execBatch.push({
        workspaceId,
        promptId: prompt.id,
        platform,
        region: "us-en",
        executedAt: execDate,
      });
    }
  }

  // Insert executions in chunks of 100
  const allExecutions: Array<{
    id: number;
    promptId: number;
    platform: string;
    executedAt: Date;
  }> = [];
  for (let i = 0; i < execBatch.length; i += 100) {
    const chunk = execBatch.slice(i, i + 100);
    const rows = await db
      .insert(promptExecutionsTable)
      .values(chunk)
      .returning();
    allExecutions.push(
      ...rows.map((r) => ({
        id: r.id,
        promptId: r.promptId,
        platform: r.platform,
        executedAt: r.executedAt,
      })),
    );
  }
  execCount = allExecutions.length;
  console.log(`  Created ${execCount} prompt executions`);

  // Generate mentions for ~35% of executions (brand mentioned)
  const mentionBatch: Array<{
    workspaceId: number;
    executionId: number;
    brandName: string;
    isOwnBrand: boolean;
    position: number;
    sentimentScore: number;
  }> = [];

  for (const exec of allExecutions) {
    // Own brand mentioned ~35% of the time
    if (Math.random() < 0.35) {
      mentionBatch.push({
        workspaceId,
        executionId: exec.id,
        brandName: "Guidewheel",
        isOwnBrand: true,
        position: randomInt(1, 3),
        sentimentScore: randomInt(80, 100),
      });
    }
    // Each competitor mentioned ~15-25% of the time
    for (const comp of COMPETITORS) {
      if (Math.random() < 0.2) {
        mentionBatch.push({
          workspaceId,
          executionId: exec.id,
          brandName: comp,
          isOwnBrand: false,
          position: randomInt(1, 5),
          sentimentScore: randomInt(60, 95),
        });
      }
    }
  }

  for (let i = 0; i < mentionBatch.length; i += 200) {
    await db.insert(mentionsTable).values(mentionBatch.slice(i, i + 200));
  }
  mentionCount = mentionBatch.length;
  console.log(`  Created ${mentionCount} mentions`);

  // Generate citations for ~50% of executions
  const citationBatch: Array<{
    workspaceId: number;
    executionId: number;
    url: string;
    domain: string;
    domainType: string;
    pageType: string;
    influenceScore: number;
    domainAuthority: number;
    hasBrandReference: boolean;
    competitorReferences: string[];
  }> = [];

  for (const exec of allExecutions) {
    if (Math.random() < 0.5) {
      const urlIdx = randomInt(0, citedUrls.length - 1);
      const url = citedUrls[urlIdx];
      const domainName = url.split("/")[0];
      const domainInfo =
        citedDomains.find((d) => d.domain === domainName) ?? citedDomains[0];

      citationBatch.push({
        workspaceId,
        executionId: exec.id,
        url,
        domain: domainInfo.domain,
        domainType: domainInfo.type,
        pageType: "Informational Article",
        influenceScore: randomInt(70, 95),
        domainAuthority: domainInfo.da,
        hasBrandReference: domainInfo.brandRef,
        competitorReferences: domainInfo.competitors,
      });
    }
  }

  for (let i = 0; i < citationBatch.length; i += 200) {
    await db.insert(citationsTable).values(citationBatch.slice(i, i + 200));
  }
  citationCount = citationBatch.length;
  console.log(`  Created ${citationCount} citations`);

  // ── Pages ────────────────────────────────────────────────────────────────

  const pageData = [
    {
      url: "/blog/machine-downtime-monitoring",
      folder: "blog",
      keyword: "machine downtime monitoring",
      clicks: 1,
      clicksChange: 100,
      impressions: 566,
      impressionsChange: 216,
      position: 8.6,
      positionChange: 2,
      ctr: 0.18,
      ctrChange: 0,
      citations: 419,
      citationsChange: 598,
      citationRate: 4.54,
      citationRateChange: 4,
    },
    {
      url: "/blog/automated-downtime-tracking",
      folder: "blog",
      keyword: "machine downtime tracking",
      clicks: 0,
      clicksChange: 0,
      impressions: 560,
      impressionsChange: 222,
      position: 4.2,
      positionChange: -15,
      ctr: 0,
      ctrChange: 0,
      citations: 305,
      citationsChange: 355,
      citationRate: 4.18,
      citationRateChange: 3,
    },
    {
      url: "/blog/predictive-maintenance-roi-2026",
      folder: "blog",
      keyword: "predictive maintenance roi",
      clicks: 0,
      clicksChange: -100,
      impressions: 1000,
      impressionsChange: 88,
      position: 3.9,
      positionChange: -17,
      ctr: 0,
      ctrChange: 0,
      citations: 279,
      citationsChange: 329,
      citationRate: 3.39,
      citationRateChange: 3,
    },
    {
      url: "/blog/production-line-monitoring",
      folder: "blog",
      keyword: "production line monitoring",
      clicks: 0,
      clicksChange: -100,
      impressions: 205,
      impressionsChange: -53,
      position: 5.3,
      positionChange: -14,
      ctr: 0,
      ctrChange: 0,
      citations: 162,
      citationsChange: -18,
      citationRate: 1.93,
      citationRateChange: 0,
    },
    {
      url: "/blog/oee-implementation",
      folder: "blog",
      keyword: "how to calculate oee",
      clicks: 0,
      clicksChange: -100,
      impressions: 309,
      impressionsChange: 173,
      position: 5.4,
      positionChange: -11,
      ctr: 0,
      ctrChange: -1,
      citations: 158,
      citationsChange: 285,
      citationRate: 2.14,
      citationRateChange: 2,
    },
    {
      url: "/blog/predictive-maintenance-software",
      folder: "blog",
      keyword: "motor current signature analysis",
      clicks: 0,
      clicksChange: 0,
      impressions: 219,
      impressionsChange: 253,
      position: 5.4,
      positionChange: 0,
      ctr: 0,
      ctrChange: 0,
      citations: 117,
      citationsChange: 550,
      citationRate: 1.01,
      citationRateChange: 1,
    },
    {
      url: "/blog/machine-condition-monitoring",
      folder: "blog",
      keyword: "predictive maintenance manufacturing",
      clicks: 0,
      clicksChange: 0,
      impressions: 138,
      impressionsChange: 130,
      position: 4.6,
      positionChange: 8,
      ctr: 0,
      ctrChange: 0,
      citations: 90,
      citationsChange: 650,
      citationRate: 1.13,
      citationRateChange: 1,
    },
    {
      url: "/solutions/increase-production",
      folder: "solutions",
      keyword: "production monitoring system",
      clicks: 0,
      clicksChange: -100,
      impressions: 1200,
      impressionsChange: 7,
      position: 22.6,
      positionChange: 90,
      ctr: 0,
      ctrChange: 0,
      citations: 86,
      citationsChange: -19,
      citationRate: 1.1,
      citationRateChange: 0,
    },
    {
      url: "/blog/production-monitoring-platform",
      folder: "blog",
      keyword: "production monitoring software",
      clicks: 0,
      clicksChange: 0,
      impressions: 138,
      impressionsChange: -32,
      position: 10.1,
      positionChange: 4,
      ctr: 0,
      ctrChange: 0,
      citations: 75,
      citationsChange: 0,
      citationRate: 1.13,
      citationRateChange: 0,
    },
    {
      url: "/blog/top-extrusion-monitoring-systems",
      folder: "blog",
      keyword: "extrusion monitoring systems",
      clicks: 0,
      clicksChange: 0,
      impressions: 181,
      impressionsChange: -57,
      position: 4.5,
      positionChange: -23,
      ctr: 0,
      ctrChange: 0,
      citations: 73,
      citationsChange: -16,
      citationRate: 1.13,
      citationRateChange: 0,
    },
    {
      url: "/blog/automated-factory-energy-monitoring",
      folder: "blog",
      keyword: "industrial energy monitoring",
      clicks: 1,
      clicksChange: 100,
      impressions: 304,
      impressionsChange: 328,
      position: 4.8,
      positionChange: -23,
      ctr: 0.33,
      ctrChange: 0,
      citations: 73,
      citationsChange: 508,
      citationRate: 0.82,
      citationRateChange: 1,
    },
    {
      url: "/solutions/reduce-downtime",
      folder: "solutions",
      keyword: "downtime reduction solutions",
      clicks: 2,
      clicksChange: 50,
      impressions: 890,
      impressionsChange: 45,
      position: 12.3,
      positionChange: -8,
      ctr: 0.22,
      ctrChange: 0,
      citations: 65,
      citationsChange: 120,
      citationRate: 0.75,
      citationRateChange: 0,
    },
    {
      url: "/blog/oee-best-practices",
      folder: "blog",
      keyword: "oee best practices",
      clicks: 0,
      clicksChange: 0,
      impressions: 245,
      impressionsChange: 112,
      position: 6.7,
      positionChange: -5,
      ctr: 0,
      ctrChange: 0,
      citations: 58,
      citationsChange: 340,
      citationRate: 0.68,
      citationRateChange: 1,
    },
    {
      url: "/blog/iot-manufacturing-guide",
      folder: "blog",
      keyword: "iot in manufacturing",
      clicks: 1,
      clicksChange: 100,
      impressions: 412,
      impressionsChange: 85,
      position: 7.2,
      positionChange: 3,
      ctr: 0.24,
      ctrChange: 0,
      citations: 52,
      citationsChange: 190,
      citationRate: 0.61,
      citationRateChange: 0,
    },
    {
      url: "/solutions/energy-monitoring",
      folder: "solutions",
      keyword: "energy monitoring manufacturing",
      clicks: 0,
      clicksChange: -100,
      impressions: 156,
      impressionsChange: -12,
      position: 15.8,
      positionChange: 15,
      ctr: 0,
      ctrChange: 0,
      citations: 41,
      citationsChange: -5,
      citationRate: 0.48,
      citationRateChange: 0,
    },
  ];

  await db.insert(pagesTable).values(
    pageData.map((p) => ({
      workspaceId,
      url: p.url,
      folder: p.folder,
      primaryKeyword: p.keyword,
      clicks: p.clicks,
      clicksChange: p.clicksChange,
      impressions: p.impressions,
      impressionsChange: p.impressionsChange,
      position: p.position,
      positionChange: p.positionChange,
      ctr: p.ctr,
      ctrChange: p.ctrChange,
      citationCount: p.citations,
      citationCountChange: p.citationsChange,
      citationRate: p.citationRate,
      citationRateChange: p.citationRateChange,
    })),
  );
  console.log(`  Created ${pageData.length} pages`);

  // ── Sentiment Themes ─────────────────────────────────────────────────────

  const themeData = [
    {
      theme: "non-invasive installation",
      score: 100,
      vol: 21.8,
      occ: 178,
      pos: true,
      ex: "Guidewheel uses a clip-on sensor that requires no integration with the PLC or machine controller, making it truly non-invasive.",
    },
    {
      theme: "rapid deployment",
      score: 99,
      vol: 14.7,
      occ: 120,
      pos: true,
      ex: "Many users report going from unboxing to live data in under an hour.",
    },
    {
      theme: "legacy machine compatibility",
      score: 98,
      vol: 12.9,
      occ: 105,
      pos: true,
      ex: "Works with machines from any era since it monitors motor current rather than requiring digital interfaces.",
    },
    {
      theme: "minimal IT burden",
      score: 97,
      vol: 7.5,
      occ: 61,
      pos: true,
      ex: "The cellular connectivity means no network configuration or IT involvement needed.",
    },
    {
      theme: "real-time visibility",
      score: 96,
      vol: 5.5,
      occ: 45,
      pos: true,
      ex: "Provides instant visibility into whether machines are running, idle, or off.",
    },
    {
      theme: "cost effectiveness",
      score: 95,
      vol: 5.0,
      occ: 41,
      pos: true,
      ex: "At a fraction of the cost of traditional MES systems, it delivers core monitoring capabilities.",
    },
    {
      theme: "micro-stop detection",
      score: 94,
      vol: 3.8,
      occ: 31,
      pos: true,
      ex: "Can detect brief stops that operators often miss or don't log.",
    },
    {
      theme: "OEE performance tracking",
      score: 93,
      vol: 2.7,
      occ: 22,
      pos: true,
      ex: "Automatically calculates OEE from machine current data without manual input.",
    },
    {
      theme: "fast time-to-value",
      score: 92,
      vol: 2.3,
      occ: 19,
      pos: true,
      ex: "ROI becomes apparent within weeks rather than the months typical of larger systems.",
    },
    {
      theme: "operator empowerment",
      score: 91,
      vol: 1.7,
      occ: 14,
      pos: true,
      ex: "Floor workers appreciate the simple dashboard that shows them their shift performance.",
    },
    {
      theme: "ai-driven insights",
      score: 90,
      vol: 1.6,
      occ: 13,
      pos: true,
      ex: "The platform uses AI to surface patterns and anomalies operators wouldn't catch.",
    },
    {
      theme: "unplanned downtime concerns",
      score: 25,
      vol: 1.5,
      occ: 12,
      pos: false,
      ex: "Some users note that while it detects downtime, it doesn't prevent it—reactive rather than predictive.",
    },
    {
      theme: "no machine control",
      score: 22,
      vol: 1.3,
      occ: 11,
      pos: false,
      ex: "Unlike PLC-integrated solutions, Guidewheel can only monitor—it cannot control or adjust machine parameters.",
    },
    {
      theme: "limited data depth",
      score: 20,
      vol: 1.2,
      occ: 10,
      pos: false,
      ex: "Advanced users wanting granular vibration or temperature data need additional sensor types.",
    },
  ];

  await db.insert(sentimentThemesTable).values(
    themeData.map((t) => ({
      workspaceId,
      theme: t.theme,
      sentimentScore: t.score,
      volumePct: t.vol,
      occurrences: t.occ,
      isPositive: t.pos,
      exampleText: t.ex,
    })),
  );
  console.log(`  Created ${themeData.length} sentiment themes`);

  // ── Reports ──────────────────────────────────────────────────────────────

  await db.insert(reportsTable).values([
    {
      workspaceId,
      name: "Weekly Executive Summary",
      dateRange: "7d",
      schedule: "weekly",
      format: "pdf",
      sections: ["overview", "visibility", "citations", "sentiment", "pages"],
      recipients: "team@company.com",
      lastGeneratedAt: daysAgo(2),
    },
    {
      workspaceId,
      name: "Monthly Visibility Report",
      dateRange: "30d",
      schedule: "monthly",
      format: "pdf+csv",
      sections: [
        "overview",
        "visibility",
        "citations",
        "community",
        "sentiment",
        "pages",
      ],
      recipients: "leadership@company.com",
      lastGeneratedAt: daysAgo(29),
    },
    {
      workspaceId,
      name: "Competitor Analysis Q1",
      dateRange: "90d",
      schedule: "one-time",
      format: "pdf",
      sections: ["overview", "visibility", "citations"],
      recipients: "strategy@company.com",
      lastGeneratedAt: daysAgo(15),
    },
  ]);
  console.log("  Created 3 reports");

  // ── Daily Metrics ────────────────────────────────────────────────────────

  console.log("  Generating daily metrics (this may take a moment)...");
  const metricBatch: Array<{
    workspaceId: number;
    date: string;
    platform: string | null;
    topic: string | null;
    competitor: string | null;
    mentionRate: number;
    shareOfVoice: number;
    citationRate: number;
    citationShare: number;
    avgPosition: number;
    sentimentScore: number;
    totalMentions: number;
    totalCitations: number;
    totalExecutions: number;
  }> = [];

  // Base metrics with slight daily variation and upward trend
  for (let day = 90; day >= 1; day--) {
    const d = dateStr(daysAgo(day));
    const trend = (90 - day) / 90; // 0 → 1 over 90 days

    // Overall aggregates (no platform/topic/competitor filter)
    metricBatch.push({
      workspaceId,
      date: d,
      platform: null,
      topic: null,
      competitor: null,
      mentionRate: randomBetween(4 + trend * 4, 5 + trend * 4),
      shareOfVoice: randomBetween(30 + trend * 20, 35 + trend * 20),
      citationRate: randomBetween(8 + trend * 12, 10 + trend * 12),
      citationShare: randomBetween(1.5 + trend * 2, 2 + trend * 2),
      avgPosition: randomBetween(1.0, 1.5),
      sentimentScore: randomInt(85 + Math.floor(trend * 10), 100),
      totalMentions: randomInt(
        15 + Math.floor(trend * 20),
        30 + Math.floor(trend * 20),
      ),
      totalCitations: randomInt(
        20 + Math.floor(trend * 30),
        40 + Math.floor(trend * 30),
      ),
      totalExecutions: randomInt(60, 90),
    });

    // Per-platform metrics
    const platformRates: Record<string, number> = {
      "Google AI Mode": randomBetween(15 + trend * 8, 25 + trend * 8),
      "Google AI Overview": randomBetween(5 + trend * 4, 10 + trend * 4),
      Gemini: randomBetween(2 + trend * 3, 5 + trend * 3),
      ChatGPT: randomBetween(0.5 + trend * 2, 2.5 + trend * 2),
      Perplexity: randomBetween(0.3 + trend * 1, 1.5 + trend * 1),
    };

    for (const plat of PLATFORMS) {
      metricBatch.push({
        workspaceId,
        date: d,
        platform: plat,
        topic: null,
        competitor: null,
        mentionRate: platformRates[plat],
        shareOfVoice: randomBetween(20 + trend * 15, 55 + trend * 15),
        citationRate: randomBetween(5 + trend * 10, 15 + trend * 15),
        citationShare: randomBetween(1 + trend * 2, 3 + trend * 2),
        avgPosition: randomBetween(1.0, 2.0),
        sentimentScore: randomInt(80, 100),
        totalMentions: randomInt(3, 10),
        totalCitations: randomInt(4, 15),
        totalExecutions: randomInt(10, 20),
      });
    }

    // Per-competitor metrics (only every 7 days to keep row count manageable)
    if (day % 7 === 0 || day <= 7) {
      for (let ci = 0; ci < COMPETITORS.length; ci++) {
        const compTrend = trend * (0.5 + Math.random() * 0.5);
        metricBatch.push({
          workspaceId,
          date: d,
          platform: null,
          topic: null,
          competitor: COMPETITORS[ci],
          mentionRate: randomBetween(1 + compTrend * 6, 3 + compTrend * 6),
          shareOfVoice: randomBetween(5 + compTrend * 15, 15 + compTrend * 15),
          citationRate: randomBetween(3 + compTrend * 8, 8 + compTrend * 8),
          citationShare: randomBetween(
            0.5 + compTrend * 1.5,
            1.5 + compTrend * 1.5,
          ),
          avgPosition: randomBetween(1.1, 2.5),
          sentimentScore: randomInt(60, 95),
          totalMentions: randomInt(5, 20),
          totalCitations: randomInt(5, 25),
          totalExecutions: randomInt(60, 90),
        });
      }
    }

    // Per-topic metrics (only every 7 days)
    if (day % 7 === 0 || day <= 7) {
      for (const topic of topics) {
        metricBatch.push({
          workspaceId,
          date: d,
          platform: null,
          topic: topic.name,
          competitor: null,
          mentionRate: randomBetween(2 + trend * 6, 8 + trend * 6),
          shareOfVoice: randomBetween(25 + trend * 20, 55 + trend * 20),
          citationRate: randomBetween(5 + trend * 10, 20 + trend * 15),
          citationShare: randomBetween(1 + trend * 2, 4 + trend * 3),
          avgPosition: randomBetween(1.0, 2.0),
          sentimentScore: randomInt(80, 100),
          totalMentions: randomInt(3, 12),
          totalCitations: randomInt(4, 18),
          totalExecutions: randomInt(10, 20),
        });
      }
    }
  }

  // Insert daily metrics in chunks
  for (let i = 0; i < metricBatch.length; i += 200) {
    await db.insert(dailyMetricsTable).values(metricBatch.slice(i, i + 200));
  }
  console.log(`  Created ${metricBatch.length} daily metric rows`);

  console.log("\nSeed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
