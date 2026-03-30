import FeaturePageLayout from "@/components/FeaturePageLayout";

export default function FeatureClaudePage() {
  return (
    <FeaturePageLayout
      platform="Claude"
      heroTitle="Claude Visibility Tracker"
      heroSubtitle="Track how Anthropic's Claude discusses and recommends your brand. Monitor mentions across Claude's web-search-enabled responses."
      faqs={[
        {
          question: "Why track Claude visibility?",
          answer:
            "Claude is rapidly growing in enterprise and developer markets. Its responses tend to be more detailed and nuanced, making brand representation particularly important.",
        },
        {
          question: "How does bVisible track Claude?",
          answer:
            "We use Claude's web search tool to get grounded, real-time responses to your tracked prompts, then analyze for brand visibility.",
        },
        {
          question: "What makes Claude different?",
          answer:
            "Claude tends to provide more balanced, well-reasoned responses with explicit source attribution. It's popular among technical and enterprise audiences.",
        },
      ]}
    />
  );
}
