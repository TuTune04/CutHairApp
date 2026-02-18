import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

interface IncidentEntry {
  occurredAt: string;
  level: "warning" | "error";
  event: string;
  message: string;
  context?: Record<string, unknown>;
}

function getIncidentLogPath(): string {
  const configuredDbPath = process.env.BOOKING_DB_PATH?.trim();
  const dataDirectory = configuredDbPath
    ? path.dirname(path.resolve(configuredDbPath))
    : path.resolve(process.cwd(), "data");
  return path.join(dataDirectory, "incident-log.json");
}

function readIncidentLogEntries(logPath: string): IncidentEntry[] {
  if (!existsSync(logPath)) {
    return [];
  }
  try {
    const parsed = JSON.parse(readFileSync(logPath, "utf8")) as IncidentEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendIncidentLog(entry: IncidentEntry): void {
  const logPath = getIncidentLogPath();
  const directory = path.dirname(logPath);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const existing = readIncidentLogEntries(logPath);
  const next = [...existing, entry].slice(-500);
  writeFileSync(logPath, JSON.stringify(next, null, 2), "utf8");
}
