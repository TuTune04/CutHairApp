import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { Appointment, BookingDatabase, ServiceItem } from "./types/index";

const dataDirectory = path.resolve(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "booking-db.json");

function getSeedServices(): ServiceItem[] {
  return [
    { id: "cut-men", name: "Cat, xa toc Nam", category: "Dich vu le", priceText: "40k", basePriceAmount: 40000, defaultDurationMinutes: 45 },
    { id: "cut-women", name: "Cat, xa toc Nu", category: "Dich vu le", priceText: "100k", basePriceAmount: 100000, defaultDurationMinutes: 60 },
    { id: "shampoo", name: "Goi Nam/Nu", category: "Dich vu le", priceText: "40k", basePriceAmount: 40000, defaultDurationMinutes: 30 },
    { id: "style-men", name: "Tao kieu Nam", category: "Dich vu le", priceText: "20k", basePriceAmount: 20000, defaultDurationMinutes: 30 },
    { id: "style-women", name: "Tao kieu Nu", category: "Dich vu le", priceText: "40k", basePriceAmount: 40000, defaultDurationMinutes: 45 },
    { id: "color-men", name: "Nhuom Nam", category: "Dich vu le", priceText: "150k", basePriceAmount: 150000, defaultDurationMinutes: 90 },
    { id: "perm-men", name: "Uon Nam", category: "Dich vu le", priceText: "250k", basePriceAmount: 250000, defaultDurationMinutes: 90 },
    { id: "chem-color", name: "Nhuom", category: "Hoa chat", priceText: "400k+", basePriceAmount: 400000, defaultDurationMinutes: 120 },
    { id: "chem-straighten", name: "Duoi / Ep", category: "Hoa chat", priceText: "500k+", basePriceAmount: 500000, defaultDurationMinutes: 120 },
    { id: "chem-curl", name: "Uon", category: "Hoa chat", priceText: "600k+", basePriceAmount: 600000, defaultDurationMinutes: 120 },
    { id: "chem-keratin", name: "Phuc hoi Keratin", category: "Hoa chat", priceText: "600k+", basePriceAmount: 600000, defaultDurationMinutes: 90 },
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
        date: "2026-02-17",
        startTime: "13:00",
        endTime: "14:30",
        source: "external",
        revenueAmount: 600000,
        createdAt: new Date().toISOString()
      }
    ]
  };
}

function normalizeDatabaseShape(raw: BookingDatabase): BookingDatabase {
  const seedServices = getSeedServices();
  const mergedServices: ServiceItem[] = (raw.services ?? []).map((service) => {
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
      notes: appointment.notes,
      createdAt: appointment.createdAt
    };
  });

  return { services, appointments };
}

export function readDatabase(): BookingDatabase {
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  if (!existsSync(databasePath)) {
    const seed = createSeedDatabase();
    writeFileSync(databasePath, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }

  const content = readFileSync(databasePath, "utf8");
  try {
    const parsed = JSON.parse(content) as BookingDatabase;
    if (!parsed.services || !Array.isArray(parsed.services) || !parsed.appointments || !Array.isArray(parsed.appointments)) {
      throw new Error("Invalid database shape");
    }
    const normalized = normalizeDatabaseShape(parsed);
    writeFileSync(databasePath, JSON.stringify(normalized, null, 2), "utf8");
    return normalized;
  } catch {
    const seed = createSeedDatabase();
    writeFileSync(databasePath, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

export function writeDatabase(data: BookingDatabase): void {
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }
  writeFileSync(databasePath, JSON.stringify(data, null, 2), "utf8");
}
