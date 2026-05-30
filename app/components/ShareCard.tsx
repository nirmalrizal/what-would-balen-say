import { forwardRef } from "react";

interface ShareCardProps {
  question: string;
  answer: string;
  likes: string;
  hearts: string;
  prays: string;
}

// Font size scales down for longer answers so text always fits
function answerFontSize(text: string): string {
  if (text.length < 20) return "52px";
  if (text.length < 40) return "40px";
  if (text.length < 70) return "30px";
  return "24px";
}

// Rendered off-screen at 600×600, captured at 2× → 1200×1200
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ question, answer, likes, hearts, prays }, ref) => (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "600px",
        height: "600px",
        backgroundColor: "#0d0e10",
        display: "flex",
        flexDirection: "column",
        padding: "48px",
        fontFamily:
          '"Inter", "Noto Sans Devanagari", ui-sans-serif, sans-serif',
        boxSizing: "border-box",
        // Subtle crimson glow in top-right corner
        backgroundImage:
          "radial-gradient(circle at 90% 0%, rgba(220,20,60,0.12) 0%, transparent 60%)",
      }}>
      {/* Top branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "36px",
        }}>
        <span style={{ fontSize: "22px" }}>🇳🇵</span>
        <span
          style={{
            color: "#4b5563",
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
          whatwouldbalensay.com
        </span>
      </div>

      {/* Question */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            color: "#dc143c",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: "600",
            marginBottom: "8px",
          }}>
          Asked
        </div>
        <div
          style={{
            color: "#9ca3af",
            fontSize: "16px",
            lineHeight: 1.5,
            fontStyle: "italic",
            borderLeft: "2px solid #dc143c",
            paddingLeft: "12px",
          }}>
          &ldquo;{question}&rdquo;
        </div>
      </div>

      {/* Answer — the hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: answerFontSize(answer),
            fontWeight: "700",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            wordBreak: "break-word",
          }}>
          {answer}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #1f2937",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#dc143c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "700",
              flexShrink: 0,
            }}>
            BS
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
              Balen{" "}
              <span style={{ color: "#1d9bf0", fontSize: "13px" }}>✓</span>
            </div>
            <div style={{ color: "#6b7280", fontSize: "11px" }}>
              Not Prime Minister of Nepal
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "14px",
            color: "#6b7280",
            fontSize: "12px",
          }}>
          <span>👍 {likes}</span>
          <span>❤️ {hearts}</span>
          <span>🙏 {prays}</span>
        </div>
      </div>
    </div>
  )
);

ShareCard.displayName = "ShareCard";
