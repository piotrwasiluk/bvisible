import FeaturePageLayout from "@/components/FeaturePageLayout";

export default function FeatureChatGPTPage() {
  return (
    <FeaturePageLayout
      platform="ChatGPT"
      heroTitle="ChatGPT Visibility Tracker"
      heroSubtitle="See exactly how your brand appears in ChatGPT responses. Track mentions, citations, and sentiment with real-time daily monitoring."
      faqs={[
        {
          question: "Why track ChatGPT visibility?",
          answer:
            "ChatGPT is the most popular AI assistant. Its responses increasingly influence purchase decisions and brand perception.",
        },
        {
          question: "How does bVisible track ChatGPT?",
          answer:
            "We query ChatGPT with web search enabled using your tracked prompts daily, then analyze responses for mentions, citations, and sentiment.",
        },
        {
          question: "How is ChatGPT different from other AI models?",
          answer:
            "ChatGPT integrates Bing search data and has its own ranking logic. It surfaces product pages and homepages more frequently than other models.",
        },
      ]}
    />
  );
}
