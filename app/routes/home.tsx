import type { MetaFunction } from "react-router";
import { useState } from "react";
import { BalenResponse } from "~/components/BalenResponse";
import { QuestionForm } from "~/components/QuestionForm";

export const meta: MetaFunction = () => [
  { title: "What Would Balen Say?" },
  {
    name: "description",
    content:
      "Ask Nepal's PM Balen Shah anything. Get a short, cryptic, very Nepali answer. Parody AI — not affiliated with PM Balen Shah.",
  },
  { name: "robots", content: "index, follow" },

  // Canonical
  { tagName: "link", rel: "canonical", href: "https://whatwouldbalensay.com/" },

  // Open Graph
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://whatwouldbalensay.com/" },
  { property: "og:site_name", content: "What Would Balen Say?" },
  { property: "og:title", content: "What Would Balen Say?" },
  {
    property: "og:description",
    content: "Ask Nepal's PM Balen Shah anything. Parody AI.",
  },
  {
    property: "og:image",
    content: "https://whatwouldbalensay.com/og-image.svg",
  },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  {
    property: "og:image:alt",
    content: "What Would Balen Say? – Nepali parody AI",
  },
  { property: "og:locale", content: "en_US" },

  // Twitter Card
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "What Would Balen Say?" },
  {
    name: "twitter:description",
    content: "Ask Nepal's PM Balen Shah anything. Parody AI.",
  },
  {
    name: "twitter:image",
    content: "https://whatwouldbalensay.com/og-image.svg",
  },
];

export default function Home() {
  const [question, setQuestion] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = (q: string) => {
    setQuestion(q);
    setIsStreaming(true);
  };

  const handleClose = () => {
    setQuestion(null);
    setIsStreaming(false);
  };

  return (
    <main className="min-h-screen bg-[#111213] text-white flex flex-col items-center justify-start px-4 py-12 gap-8">
      {/* Header */}
      <header className="text-center max-w-lg">
        <div className="text-6xl mb-4 select-none">🇳🇵</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
          What Would <span className="text-[#dc143c]">Balen</span> Say?
        </h1>
        <p className="text-[#b0b3b8] text-sm">
          Parody AI · Not Nepal Sarkar · Not PM Balen Shah
        </p>
      </header>

      {/* Question form */}
      <QuestionForm onSubmit={handleSubmit} isDisabled={isStreaming} />

      {/* Response card */}
      {question && (
        <div className="w-full max-w-lg">
          <BalenResponse
            key={question}
            question={question}
            onClose={handleClose}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto text-[#b0b3b8] text-xs text-center max-w-sm leading-relaxed space-y-2">
        <p>
          Parody/satire · Not affiliated with Balen Shah or Syuchatar AI Compute
          · Powered by{" "}
          <a
            href="https://anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6b7280] hover:text-white transition-colors">
            Claude AI
          </a>
        </p>
        <p className="flex items-center justify-center gap-3">
          <a
            href="https://github.com/nirmalrizal/what-would-balen-say"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6b7280] hover:text-white transition-colors">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Contribute
          </a>
          <span>·</span>
          <a
            href="https://ko-fi.com/whatwouldbalensay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6b7280] hover:text-white transition-colors">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
            Donate
          </a>
        </p>
      </footer>
    </main>
  );
}
