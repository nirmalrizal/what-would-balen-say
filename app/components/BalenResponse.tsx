import { useEffect, useRef, useState, useMemo } from "react";
import { ShareButtons } from "./ShareButtons";

interface Props {
  question: string;
  onClose: () => void;
}

type Phase = "thinking" | "streaming" | "done" | "error";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function fakeCount(seed: number, min: number, max: number): string {
  const n = min + (seed % (max - min));
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export function BalenResponse({ question, onClose }: Props) {
  const [tokens, setTokens] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("thinking");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );

  const seed = useMemo(() => hashString(question), [question]);
  const engagement = useMemo(
    () => ({
      likes: fakeCount(seed, 100_000, 999_000),
      hearts: fakeCount(seed ^ 0xdeadbeef, 50_000, 600_000),
      prays: fakeCount(seed ^ 0xcafe, 10_000, 200_000),
    }),
    [seed]
  );

  useEffect(() => {
    const controller = new AbortController();
    let buffer = "";

    async function fetchStream() {
      try {
        const res = await fetch(`/api/ask?q=${encodeURIComponent(question)}`, {
          signal: controller.signal,
        });
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        readerRef.current = reader;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            if (!part.startsWith("data: ")) continue;
            const payload = part.slice(6).trim();
            if (payload === "[DONE]") {
              setPhase("done");
              return;
            }
            try {
              const parsed = JSON.parse(payload) as Record<string, unknown>;
              if (typeof parsed.token === "string") {
                setPhase("streaming");
                setTokens((prev) => [...prev, parsed.token as string]);
              } else if (typeof parsed.queue_position === "number") {
                setQueuePosition(parsed.queue_position as number);
              } else if (parsed.error) {
                setErrorMsg(parsed.error as string);
                setPhase("error");
              }
            } catch {
              // ignore malformed chunks
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setPhase("error");
          setErrorMsg("connection_failed");
        }
      }
    }

    fetchStream();

    return () => {
      controller.abort();
      readerRef.current?.cancel();
    };
  }, [question]);

  const fullText = tokens.join("");

  const errorText = () => {
    if (errorMsg === "rate_limited")
      return "Too many questions. Balen is busy governing. Try in a minute.";
    if (errorMsg === "question_too_long")
      return "Question too long! Keep it short — Balen does.";
    return "Something went wrong. Balen blames the contractors.";
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-xl bg-[#1c1e21] border border-[#3a3b3c] shadow-2xl overflow-hidden">
      {/* Post header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#3a3b3c]">
        <div className="w-10 h-10 rounded-full bg-[#dc143c] flex items-center justify-center text-white font-bold text-sm shrink-0 select-none">
          BS
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm flex items-center gap-1">
            Balen
            <svg
              className="w-3.5 h-3.5 text-[#1877f2] shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xs text-[#b0b3b8]">
            Not Prime Minister of Nepal · just now
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#b0b3b8] hover:text-white transition-colors text-xl leading-none px-1"
          aria-label="Close">
          ×
        </button>
      </div>

      {/* Question */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[#b0b3b8] text-xs uppercase tracking-wider font-medium mb-1">
          Question
        </p>
        <p className="text-[#e4e6eb] text-sm leading-relaxed">{question}</p>
      </div>

      <div className="mx-5 border-t border-[#3a3b3c]" />

      {/* Answer */}
      <div className="p-5 min-h-[72px]">
        {phase === "thinking" && (
          <p className="text-[#b0b3b8] text-sm animate-pulse">
            {queuePosition != null && queuePosition > 0
              ? `Queue: ${queuePosition} ahead — Balen will be with you shortly...`
              : "Balen is thinking..."}
          </p>
        )}
        {(phase === "streaming" || phase === "done") && (
          <>
            <p className="text-[#b0b3b8] text-xs uppercase tracking-wider font-medium mb-2">
              Balen says
            </p>
            <p className="text-white text-2xl font-semibold leading-snug tracking-wide">
              {fullText}
              {phase === "streaming" && (
                <span className="inline-block w-0.5 h-6 bg-[#dc143c] ml-0.5 animate-pulse align-middle" />
              )}
            </p>
          </>
        )}
        {phase === "error" && (
          <p className="text-[#dc143c] text-sm">{errorText()}</p>
        )}
      </div>

      {/* Engagement + share */}
      {phase === "done" && (
        <>
          <div className="px-5 pb-3 pt-2 border-t border-[#3a3b3c] flex items-center gap-4 text-[#b0b3b8] text-xs">
            <span>👍 {engagement.likes}</span>
            <span>❤️ {engagement.hearts}</span>
            <span>🙏 {engagement.prays}</span>
          </div>

          <div className="border-t border-[#3a3b3c]">
            <ShareButtons
              question={question}
              answer={fullText}
              likes={engagement.likes}
              hearts={engagement.hearts}
              prays={engagement.prays}
            />
          </div>
        </>
      )}
    </div>
  );
}
