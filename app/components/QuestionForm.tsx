import { useState } from "react";
import { trackEvent } from "~/lib/analytics";

interface Props {
  onSubmit: (question: string) => void;
  isDisabled?: boolean;
}

const MAX_LEN = 500;

export function QuestionForm({ onSubmit, isDisabled }: Props) {
  const [value, setValue] = useState("");
  const remaining = MAX_LEN - value.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || isDisabled) return;
    trackEvent("ask_question", { question_length: q.length });
    onSubmit(q);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LEN))}
          placeholder="What would Balen say about...?"
          rows={3}
          disabled={isDisabled}
          className="w-full rounded-xl bg-[#3a3b3c] text-white placeholder:text-[#b0b3b8]
                     border border-[#4a4b4c] focus:border-[#dc143c] focus:outline-none
                     resize-none px-4 py-3 text-sm transition-colors disabled:opacity-60"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
        />
        <span
          className={`absolute bottom-3 right-3 text-xs transition-colors select-none ${
            remaining < 50 ? "text-[#dc143c]" : "text-[#b0b3b8]"
          }`}
        >
          {remaining}
        </span>
      </div>
      <button
        type="submit"
        disabled={!value.trim() || isDisabled}
        className="mt-3 w-full rounded-xl bg-[#dc143c] hover:bg-[#b01030] disabled:opacity-40
                   disabled:cursor-not-allowed text-white font-semibold py-3 text-sm
                   transition-colors active:scale-[0.98]"
      >
        {isDisabled ? "Balen is speaking..." : "Ask Balen !!"}
      </button>
    </form>
  );
}
