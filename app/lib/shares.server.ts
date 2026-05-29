import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve("data");
const SHARES_FILE = path.join(DATA_DIR, "shares.json");

interface ShareEntry {
  question: string;
  answer: string;
  count: number;
  lastShared: string;
}

interface SharesData {
  entries: ShareEntry[];
}

function readData(): SharesData {
  try {
    const raw = fs.readFileSync(SHARES_FILE, "utf-8");
    return JSON.parse(raw) as SharesData;
  } catch {
    return { entries: [] };
  }
}

function writeData(data: SharesData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(SHARES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function recordShare(question: string, answer: string): void {
  const data = readData();
  const existing = data.entries.find((e) => e.question === question);
  if (existing) {
    existing.count++;
    existing.lastShared = new Date().toISOString();
  } else {
    data.entries.push({ question, answer, count: 1, lastShared: new Date().toISOString() });
  }
  writeData(data);
}

export function getTopShares(n: number): ShareEntry[] {
  const data = readData();
  return [...data.entries].sort((a, b) => b.count - a.count).slice(0, n);
}
