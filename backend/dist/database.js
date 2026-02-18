"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDatabase = readDatabase;
exports.writeDatabase = writeDatabase;
const node_fs_1 = require("node:fs");
const node_crypto_1 = require("node:crypto");
const node_path_1 = __importDefault(require("node:path"));
const dataDirectory = node_path_1.default.resolve(process.cwd(), "data");
const databasePath = node_path_1.default.join(dataDirectory, "booking-db.json");
function getSeedServices() {
    return [
        { id: "cut-men", name: "Cat, xa toc Nam", category: "Dich vu le", priceText: "40k", defaultDurationMinutes: 45 },
        { id: "cut-women", name: "Cat, xa toc Nu", category: "Dich vu le", priceText: "100k", defaultDurationMinutes: 60 },
        { id: "shampoo", name: "Goi Nam/Nu", category: "Dich vu le", priceText: "40k", defaultDurationMinutes: 30 },
        { id: "style-men", name: "Tao kieu Nam", category: "Dich vu le", priceText: "20k", defaultDurationMinutes: 30 },
        { id: "style-women", name: "Tao kieu Nu", category: "Dich vu le", priceText: "40k", defaultDurationMinutes: 45 },
        { id: "color-men", name: "Nhuom Nam", category: "Dich vu le", priceText: "150k", defaultDurationMinutes: 90 },
        { id: "perm-men", name: "Uon Nam", category: "Dich vu le", priceText: "250k", defaultDurationMinutes: 90 },
        { id: "chem-color", name: "Nhuom", category: "Hoa chat", priceText: "400k+", defaultDurationMinutes: 120 },
        { id: "chem-straighten", name: "Duoi / Ep", category: "Hoa chat", priceText: "500k+", defaultDurationMinutes: 120 },
        { id: "chem-curl", name: "Uon", category: "Hoa chat", priceText: "600k+", defaultDurationMinutes: 120 },
        { id: "chem-keratin", name: "Phuc hoi Keratin", category: "Hoa chat", priceText: "600k+", defaultDurationMinutes: 90 },
        { id: "collagen", name: "Hap, phuc hoi Collagen", category: "Phuc hoi", priceText: "250k", defaultDurationMinutes: 60 }
    ];
}
function createSeedDatabase() {
    return {
        services: getSeedServices(),
        appointments: [
            {
                id: (0, node_crypto_1.randomUUID)(),
                customerName: "Nguyen Van An",
                phoneNumber: "0901234567",
                serviceName: "Cat, xa toc Nam",
                date: "2026-02-17",
                startTime: "09:00",
                endTime: "10:00",
                notes: "Khach quen",
                createdAt: new Date().toISOString()
            },
            {
                id: (0, node_crypto_1.randomUUID)(),
                customerName: "Tran Thi Hoa",
                phoneNumber: "0912345678",
                serviceName: "Phuc hoi Keratin",
                date: "2026-02-17",
                startTime: "13:00",
                endTime: "14:30",
                createdAt: new Date().toISOString()
            }
        ]
    };
}
function readDatabase() {
    if (!(0, node_fs_1.existsSync)(dataDirectory)) {
        (0, node_fs_1.mkdirSync)(dataDirectory, { recursive: true });
    }
    if (!(0, node_fs_1.existsSync)(databasePath)) {
        const seed = createSeedDatabase();
        (0, node_fs_1.writeFileSync)(databasePath, JSON.stringify(seed, null, 2), "utf8");
        return seed;
    }
    const content = (0, node_fs_1.readFileSync)(databasePath, "utf8");
    try {
        const parsed = JSON.parse(content);
        if (!parsed.services || !Array.isArray(parsed.services) || !parsed.appointments || !Array.isArray(parsed.appointments)) {
            throw new Error("Invalid database shape");
        }
        return parsed;
    }
    catch {
        const seed = createSeedDatabase();
        (0, node_fs_1.writeFileSync)(databasePath, JSON.stringify(seed, null, 2), "utf8");
        return seed;
    }
}
function writeDatabase(data) {
    if (!(0, node_fs_1.existsSync)(dataDirectory)) {
        (0, node_fs_1.mkdirSync)(dataDirectory, { recursive: true });
    }
    (0, node_fs_1.writeFileSync)(databasePath, JSON.stringify(data, null, 2), "utf8");
}
