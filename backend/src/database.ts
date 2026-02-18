import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync, renameSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { Appointment, BookingDatabase, ServiceItem } from "./types/index";

const LOCK_WAIT_TIMEOUT_MS = 2_000;
const LOCK_RETRY_INTERVAL_MS = 25;
const STALE_LOCK_MS = 30_000;

function getDatabasePath(): string {
  const configured = process.env.BOOKING_DB_PATH?.trim();
  if (configured) {
    return path.resolve(configured);
  }
  return path.resolve(process.cwd(), "data", "booking-db.json");
}

function getDatabasePaths(): {
  dataDirectory: string;
  databasePath: string;
  lockDirectoryPath: string;
  atomicTempPath: string;
} {
  const databasePath = getDatabasePath();
  const dataDirectory = path.dirname(databasePath);
  return {
    dataDirectory,
    databasePath,
    lockDirectoryPath: `${databasePath}.lock`,
    atomicTempPath: `${databasePath}.tmp`
  };
}

function sleepMs(ms: number): void {
  // Blocking sleep is acceptable here because this backend intentionally uses sync fs for local single-node use.
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function tryCleanupStaleLock(): void {
  const { lockDirectoryPath } = getDatabasePaths();
  if (!existsSync(lockDirectoryPath)) {
    return;
  }
  try {
    const lockStat = statSync(lockDirectoryPath);
    const lockAge = Date.now() - lockStat.mtimeMs;
    if (lockAge > STALE_LOCK_MS) {
      rmSync(lockDirectoryPath, { recursive: true, force: true });
    }
  } catch {
    rmSync(lockDirectoryPath, { recursive: true, force: true });
  }
}

function acquireWriteLockOrThrow(): void {
  const { lockDirectoryPath } = getDatabasePaths();
  const start = Date.now();
  while (true) {
    try {
      mkdirSync(lockDirectoryPath);
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "EEXIST") {
        throw error;
      }
      tryCleanupStaleLock();
      if (!existsSync(lockDirectoryPath)) {
        continue;
      }
      if (Date.now() - start > LOCK_WAIT_TIMEOUT_MS) {
        throw new Error("Database write lock timeout");
      }
      sleepMs(LOCK_RETRY_INTERVAL_MS);
    }
  }
}

function releaseWriteLock(): void {
  const { lockDirectoryPath } = getDatabasePaths();
  if (existsSync(lockDirectoryPath)) {
    rmSync(lockDirectoryPath, { recursive: true, force: true });
  }
}

function ensureDataDirectory(): void {
  const { dataDirectory } = getDatabasePaths();
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }
}

function persistDatabaseAtomically(data: BookingDatabase): void {
  const { atomicTempPath, databasePath } = getDatabasePaths();
  const content = JSON.stringify(data, null, 2);
  writeFileSync(atomicTempPath, content, "utf8");
  renameSync(atomicTempPath, databasePath);
}

function writeCorruptedBackup(content: string): void {
  const { dataDirectory } = getDatabasePaths();
  const backupPath = path.join(dataDirectory, `booking-db.corrupted.${Date.now()}.json`);
  writeFileSync(backupPath, content, "utf8");
}

function getSeedServices(): ServiceItem[] {
  return [
    { id: "cut-men", name: "Cat, xa toc Nam", category: "Dich vu le", priceText: "40k", basePriceAmount: 40000, defaultDurationMinutes: 45 },
    { id: "cut-women", name: "Cat, xa toc Nu", category: "Dich vu le", priceText: "100k", basePriceAmount: 100000, defaultDurationMinutes: 60 },
    { id: "shampoo", name: "Goi Nam/Nu", category: "Dich vu le", priceText: "40k", basePriceAmount: 40000, defaultDurationMinutes: 30 },
    { id: "style-men", name: "Tao kieu Nam", category: "Dich vu le", priceText: "20k", basePriceAmount: 20000, defaultDurationMinutes: 30 },
    { id: "style-women", name: "Tao kieu Nu", category: "Dich vu le", priceText: "40k", basePriceAmount: 40000, defaultDurationMinutes: 45 },
    { id: "color-men", name: "Nhuom Nam", category: "Dich vu le", priceText: "150k", basePriceAmount: 150000, defaultDurationMinutes: 90 },
    { id: "line", name: "Lam line (1 lan tay)", category: "Dich vu le", priceText: "200k", basePriceAmount: 200000, defaultDurationMinutes: 120 },
    { id: "bleach-men", name: "Tay Nam (1 lan tay)", category: "Dich vu le", priceText: "200k", basePriceAmount: 200000, defaultDurationMinutes: 120 },
    { id: "perm-men", name: "Uon Nam", category: "Dich vu le", priceText: "250k", basePriceAmount: 250000, defaultDurationMinutes: 90 },
    { id: "straight-root", name: "Ep chan", category: "Dich vu le", priceText: "250k", basePriceAmount: 250000, defaultDurationMinutes: 90 },
    { id: "volume-root", name: "Uon phong chan", category: "Dich vu le", priceText: "250k", basePriceAmount: 250000, defaultDurationMinutes: 90 },
    { id: "chem-color", name: "Nhuom", category: "Hoa chat", priceText: "400k-700k", basePriceAmount: 400000, defaultDurationMinutes: 120 },
    { id: "chem-straighten", name: "Duoi / Ep", category: "Hoa chat", priceText: "500k-800k", basePriceAmount: 500000, defaultDurationMinutes: 120 },
    { id: "chem-curl", name: "Uon", category: "Hoa chat", priceText: "600k-900k", basePriceAmount: 600000, defaultDurationMinutes: 120 },
    { id: "chem-bleach-women", name: "Tay Nu (1 lan tay)", category: "Hoa chat", priceText: "300k-500k", basePriceAmount: 300000, defaultDurationMinutes: 150 },
    { id: "chem-keratin", name: "Phuc hoi Keratin", category: "Hoa chat", priceText: "600k-800k", basePriceAmount: 600000, defaultDurationMinutes: 90 },
    { id: "collagen", name: "Hap, phuc hoi Collagen", category: "Phuc hoi", priceText: "250k", basePriceAmount: 250000, defaultDurationMinutes: 60 }
  ];
}

function createSeedDatabase(): BookingDatabase {
  return {
    services: getSeedServices(),
    appointments: [
      {
        id: randomUUID(),
        customerName: "Nguyen Van An",
        phoneNumber: "0901234567",
        serviceName: "Cat, xa toc Nam",
        serviceNames: ["Cat, xa toc Nam"],
        date: "2026-02-17",
        startTime: "09:00",
        endTime: "10:00",
        source: "app",
        revenueAmount: 40000,
        notes: "Khach quen",
        createdAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        customerName: "Tran Thi Hoa",
        phoneNumber: "0912345678",
        serviceName: "Phuc hoi Keratin",
        serviceNames: ["Phuc hoi Keratin"],
        date: "2026-02-17",
        startTime: "00:00",
        endTime: "00:00",
        source: "external",
        revenueAmount: 600000,
        createdAt: new Date().toISOString()
      }
    ]
  };
}

function normalizeDatabaseShape(raw: BookingDatabase): BookingDatabase {
  const seedServices = getSeedServices();
  const mergedServicesFromRaw: ServiceItem[] = (raw.services ?? []).map((service) => {
    const fallback = seedServices.find((item) => item.id === service.id || item.name === service.name);
    return {
      id: service.id,
      name: service.name,
      category: service.category,
      priceText: service.priceText ?? fallback?.priceText ?? "0k",
      basePriceAmount: service.basePriceAmount ?? fallback?.basePriceAmount ?? 0,
      defaultDurationMinutes: service.defaultDurationMinutes ?? fallback?.defaultDurationMinutes ?? 60
    };
  });

  const missingSeedServices = seedServices.filter(
    (seed) => !mergedServicesFromRaw.some((existing) => existing.id === seed.id)
  );
  const mergedServices = [...mergedServicesFromRaw, ...missingSeedServices];
  const services = mergedServices.length > 0 ? mergedServices : seedServices;

  const appointments: Appointment[] = (raw.appointments ?? []).map((appointment) => {
    const fallbackService = services.find((service) => service.name === appointment.serviceName);
    return {
      id: appointment.id,
      customerName: appointment.customerName,
      phoneNumber: appointment.phoneNumber,
      serviceName: appointment.serviceName,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      source: appointment.source ?? "app",
      revenueAmount: appointment.revenueAmount ?? fallbackService?.basePriceAmount ?? 0,
      serviceNames: appointment.serviceNames ?? [appointment.serviceName],
      notes: appointment.notes,
      createdAt: appointment.createdAt
    };
  });

  return { services, appointments };
}

export function readDatabase(): BookingDatabase {
  const { databasePath } = getDatabasePaths();
  ensureDataDirectory();

  if (!existsSync(databasePath)) {
    const seed = createSeedDatabase();
    writeDatabase(seed);
    return seed;
  }

  const content = readFileSync(databasePath, "utf8");
  try {
    const parsed = JSON.parse(content) as BookingDatabase;
    if (!parsed.services || !Array.isArray(parsed.services) || !parsed.appointments || !Array.isArray(parsed.appointments)) {
      throw new Error("Invalid database shape");
    }
    const normalized = normalizeDatabaseShape(parsed);
    writeDatabase(normalized);
    return normalized;
  } catch {
    // Preserve unreadable data for investigation before resetting to seed.
    writeCorruptedBackup(content);
    const seed = createSeedDatabase();
    writeDatabase(seed);
    return seed;
  }
}

export function writeDatabase(data: BookingDatabase): void {
  const { atomicTempPath } = getDatabasePaths();
  ensureDataDirectory();
  acquireWriteLockOrThrow();
  try {
    persistDatabaseAtomically(data);
  } finally {
    if (existsSync(atomicTempPath)) {
      rmSync(atomicTempPath, { force: true });
    }
    releaseWriteLock();
  }
}
