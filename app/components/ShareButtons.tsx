import { useRef, useState } from "react";
import { ShareCard } from "./ShareCard";

interface Props {
  question: string;
  answer: string;
  likes: string;
  hearts: string;
  prays: string;
}

type Status = "idle" | "capturing" | "done" | "error";

async function captureCard(el: HTMLDivElement): Promise<Blob> {
  // Dynamic import keeps this out of the SSR bundle
  const { toPng } = await import("html-to-image");
  await document.fonts.ready;
  const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
  const res = await fetch(dataUrl);
  return res.blob();
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "balen-says.png";
  a.click();
  URL.revokeObjectURL(url);
}

const platforms = [
  { id: "download", label: "⬇", title: "Download image" },
  { id: "twitter", label: "𝕏", title: "Share on X / Twitter" },
  { id: "facebook", label: "f", title: "Share on Facebook" },
  { id: "linkedin", label: "in", title: "Share on LinkedIn" },
  { id: "whatsapp", label: "💬", title: "Share on WhatsApp" },
  { id: "instagram", label: "◎", title: "Share on Instagram (saves image)" },
  { id: "tiktok", label: "♪", title: "Share on TikTok (saves image)" },
] as const;

type Platform = (typeof platforms)[number]["id"];

export function ShareButtons({ question, answer, likes, hearts, prays }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function getBlob(): Promise<Blob | null> {
    if (!cardRef.current) return null;
    setStatus("capturing");
    try {
      const blob = await captureCard(cardRef.current);
      setStatus("done");
      return blob;
    } catch {
      setStatus("error");
      showToast("Could not generate image. Try again.");
      return null;
    }
  }

  async function handlePlatform(platform: Platform) {
    const siteUrl = encodeURIComponent(window.location.origin);
    const tweetText = encodeURIComponent(
      `"${answer}" 🇳🇵\n\nAsk Balen anything:`,
    );

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${tweetText}&url=${siteUrl}`,
        "_blank",
        "noopener",
      );
      return;
    }

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${siteUrl}&quote=${encodeURIComponent(`"${answer}" 🇳🇵`)}`,
        "_blank",
        "noopener",
      );
      return;
    }

    if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${siteUrl}`,
        "_blank",
        "noopener",
      );
      return;
    }

    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`"${answer}" 🇳🇵\n\nAsk Balen anything: ${window.location.origin}`)}`,
        "_blank",
        "noopener",
      );
      return;
    }

    // Image-based platforms: Instagram, TikTok, and Download
    const blob = await getBlob();
    if (!blob) return;

    if (platform === "download") {
      downloadBlob(blob);
      showToast("Image saved!");
      return;
    }

    // Instagram / TikTok — try Web Share API first (works on mobile)
    const file = new File([blob], "balen-says.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "What Would Balen Say?",
          text: `"${answer}" 🇳🇵`,
        });
        return;
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }

    // Desktop fallback: download + prompt
    downloadBlob(blob);
    const appName = platform === "instagram" ? "Instagram" : "TikTok";
    showToast(`Image saved! Open ${appName} to post it.`);
  }

  const isCapturing = status === "capturing";

  return (
    <div className="px-4 pb-4">
      {/* Off-screen share card — must be in DOM for capture */}
      <ShareCard
        ref={cardRef}
        question={question}
        answer={answer}
        likes={likes}
        hearts={hearts}
        prays={prays}
      />

      <p className="text-[#6b7280] text-xs mb-2 uppercase tracking-wider font-medium">
        Share
      </p>

      <div className="flex flex-wrap gap-2">
        {platforms.map(({ id, label, title }) => (
          <button
            key={id}
            title={title}
            disabled={isCapturing}
            onClick={() => handlePlatform(id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              transition-all border disabled:opacity-50 disabled:cursor-wait
              ${id === "download"
                ? "bg-[#dc143c] hover:bg-[#b01030] text-white border-transparent"
                : "bg-[#2a2b2e] hover:bg-[#3a3b3e] text-[#e4e6eb] border-[#3a3b3c]"
              }
            `}
          >
            <span className={id === "download" ? "" : "font-bold"}>{label}</span>
            {id === "download" && (
              <span>{isCapturing ? "Generating..." : "Save image"}</span>
            )}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="mt-3 text-xs text-[#b0b3b8] bg-[#2a2b2e] rounded-lg px-3 py-2 border border-[#3a3b3c]">
          {toast}
        </div>
      )}
    </div>
  );
}
