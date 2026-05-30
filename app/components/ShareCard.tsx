import { forwardRef } from "react";

interface ShareCardProps {
  question: string;
  answer: string;
  likes: string;
  hearts: string;
  prays: string;
}

function answerFontSize(text: string): string {
  if (text.length < 30) return "36px";
  if (text.length < 60) return "28px";
  if (text.length < 100) return "24px";
  return "20px";
}

const labelStyle: React.CSSProperties = {
  color: "#b0b3b8",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: "600",
  marginBottom: "6px",
};

const dividerStyle: React.CSSProperties = {
  margin: "0 20px",
  borderTop: "1px solid #3a3b3c",
  borderBottom: "none",
  borderLeft: "none",
  borderRight: "none",
};

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ question, answer, likes, hearts, prays }, ref) => (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "600px",
        fontFamily:
          '"Inter", "Noto Sans Devanagari", ui-sans-serif, sans-serif',
        backgroundColor: "#1c1e21",
        border: "1px solid #3a3b3c",
        borderRadius: "12px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          borderBottom: "1px solid #3a3b3c",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#dc143c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "700",
            fontSize: "14px",
            flexShrink: 0,
          }}
        >
          BS
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: "600",
              color: "#ffffff",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Balen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div style={{ fontSize: "12px", color: "#b0b3b8" }}>
            Not Prime Minister of Nepal · just now
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: "16px 20px 12px" }}>
        <p style={labelStyle}>Question</p>
        <p style={{ color: "#e4e6eb", fontSize: "14px", lineHeight: 1.5 }}>
          {question}
        </p>
      </div>

      <hr style={dividerStyle} />

      {/* Answer */}
      <div style={{ padding: "16px 20px 20px" }}>
        <p style={labelStyle}>Balen says</p>
        <p
          style={{
            color: "#ffffff",
            fontSize: answerFontSize(answer),
            fontWeight: "700",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
            wordBreak: "break-word",
            margin: 0,
          }}
        >
          {answer}
        </p>
      </div>

      {/* Engagement footer */}
      <div
        style={{
          padding: "12px 20px 16px",
          borderTop: "1px solid #3a3b3c",
          display: "flex",
          gap: "20px",
          color: "#b0b3b8",
          fontSize: "13px",
          alignItems: "center",
        }}
      >
        {(
          [
            ["👍", likes],
            ["❤️", hearts],
            ["🙏", prays],
          ] as [string, string][]
        ).map(([emoji, count]) => (
          <div
            key={emoji}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>{emoji}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
);

ShareCard.displayName = "ShareCard";
