import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve("data");
const LOG_FILE = path.join(DATA_DIR, "qa-log.jsonl");

export function logQA(question: string, answer: string, ip: string): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), ip, question, answer });
  fs.appendFileSync(LOG_FILE, entry + "\n", "utf-8");
}
