import { useEffect, useState } from "react";

interface UsageStats {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCostUSD: number;
  updatedAt: string;
}

const POLL_MS = 5 * 60 * 1000; // 5 minutes

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function formatCost(usd: number): string {
  if (usd === 0) return "$0.00";
  if (usd < 0.001) return `$${usd.toFixed(5)}`;
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  if (usd < 1) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}

export function UsageBadge() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  // Tick every 30s so "X ago" text stays fresh
  const [, setTick] = useState(0);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch("/api/usage");
        if (res.ok) {
          setStats(await res.json());
          setFetchedAt(new Date().toISOString());
        }
      } catch {
        // non-critical
      }
    }

    poll();
    const pollId = setInterval(poll, POLL_MS);
    const tickId = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => {
      clearInterval(pollId);
      clearInterval(tickId);
    };
  }, []);

  if (!stats || !fetchedAt) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 text-[#4b5563] text-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
      <span>
        {stats.totalRequests.toLocaleString()} questions ·{" "}
        <span className="text-[#6b7280]">
          {formatCost(stats.estimatedCostUSD)} API cost
        </span>{" "}
        · <span title={fetchedAt}>updated {timeAgo(fetchedAt)}</span>
      </span>
    </div>
  );
}
