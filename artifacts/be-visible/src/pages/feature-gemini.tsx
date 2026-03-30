import FeaturePageLayout from "@/components/FeaturePageLayout";

export default function FeatureGeminiPage() {
  return (
    <FeaturePageLayout
      platform="Gemini"
      heroTitle="Gemini Visibility Tracker"
      heroSubtitle="Monitor how Google's Gemini represents your brand. Track visibility with Google Search grounding for the most accurate results."
      faqs={[
        {
          question: "Why track Gemini visibility?",
          answer:
            "Gemini is deeply integrated with Google Search and Google AI Mode. As Google rolls out AI answers, Gemini's representation of your brand directly impacts your search visibility.",
        },
        {
          question: "How does bVisible track Gemini?",
          answer:
            "We use Gemini's Google Search grounding feature, which means responses are based on current web data — not just training data.",
        },
        {
          question: "What makes Gemini different?",
          answer:
            "Gemini has direct access to Google's search index, making its citations closely aligned with traditional SEO signals. Brands with strong SEO tend to perform better in Gemini.",
        },
      ]}
    />
  );
}
