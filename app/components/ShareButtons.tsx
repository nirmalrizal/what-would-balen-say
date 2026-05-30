import { useRef, useState } from "react";
import { ShareCard } from "./ShareCard";
import { trackEvent } from "~/lib/analytics";

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
  const dataUrl = await toPng(el, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#1c1e21",
    width: 600,
  });
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

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.873L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const platforms = [
  { id: "download", Icon: IconDownload, title: "Download image" },
  { id: "twitter", Icon: IconX, title: "Share on X / Twitter" },
  { id: "facebook", Icon: IconFacebook, title: "Share on Facebook" },
  { id: "linkedin", Icon: IconLinkedIn, title: "Share on LinkedIn" },
  { id: "whatsapp", Icon: IconWhatsApp, title: "Share on WhatsApp" },
  { id: "instagram", Icon: IconInstagram, title: "Share on Instagram (saves image)" },
  { id: "tiktok", Icon: IconTikTok, title: "Share on TikTok (saves image)" },
] as const;

type Platform = (typeof platforms)[number]["id"];

function recordShare(question: string, answer: string) {
  fetch("/api/record-share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer }),
  }).catch(() => {
    // fire-and-forget — non-critical
  });
}

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
    trackEvent("share", { platform });
    const siteUrl = encodeURIComponent(window.location.origin);
    const tweetText = encodeURIComponent(
      `"${answer}" 🇳🇵\n\nAsk Balen anything:`,
    );

    if (platform === "twitter") {
      recordShare(question, answer);
      window.open(
        `https://twitter.com/intent/tweet?text=${tweetText}&url=${siteUrl}`,
        "_blank",
        "noopener",
      );
      return;
    }

    if (platform === "facebook") {
      recordShare(question, answer);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${siteUrl}`,
        "_blank",
        "noopener",
      );
      return;
    }

    if (platform === "linkedin") {
      recordShare(question, answer);
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${siteUrl}`,
        "_blank",
        "noopener",
      );
      return;
    }

    if (platform === "whatsapp") {
      recordShare(question, answer);
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
        recordShare(question, answer);
        return;
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }

    // Desktop fallback: download + prompt
    downloadBlob(blob);
    recordShare(question, answer);
    const appName = platform === "instagram" ? "Instagram" : "TikTok";
    showToast(`Image saved! Open ${appName} to post it.`);
  }

  const isCapturing = status === "capturing";

  return (
    <div className="px-4 pb-4">
      {/* Clip container hides the card without off-screen positioning */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <ShareCard
          ref={cardRef}
          question={question}
          answer={answer}
          likes={likes}
          hearts={hearts}
          prays={prays}
        />
      </div>

      <p className="text-[#6b7280] text-xs mb-2 uppercase tracking-wider font-medium">
        Share
      </p>

      <div className="flex flex-wrap gap-2">
        {platforms.map(({ id, Icon, title }) => (
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
            <Icon />
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
