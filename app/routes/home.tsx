import type { MetaFunction } from "react-router";
import { useState } from "react";
import { BalenResponse } from "~/components/BalenResponse";
import { QuestionForm } from "~/components/QuestionForm";
import { UsageBadge } from "~/components/UsageBadge";

export const meta: MetaFunction = () => [
  { title: "What Would Balen Say? 🇳🇵" },
  {
    name: "description",
    content:
      "Ask Nepal's PM Balen Shah anything. Get a short, cryptic, very Nepali answer. Parody only.",
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
          What Would{" "}
          <span className="text-[#dc143c]">Balen</span> Say?
        </h1>
        <p className="text-[#b0b3b8] text-sm">
          Parody AI · Nepal Sarkar होइन · PM Balen Shah होइन
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
        <UsageBadge />
        <p>
          Parody/satire · Not affiliated with Balen Shah or KMC ·{" "}
          Powered by{" "}
          <a
            href="https://anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6b7280] hover:text-white transition-colors"
          >
            Claude AI
          </a>
        </p>
      </footer>
    </main>
  );
}
