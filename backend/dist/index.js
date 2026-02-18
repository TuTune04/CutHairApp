"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const booking_service_1 = require("./booking-service");
const app = (0, express_1.default)();
const port = Number(process.env.PORT ?? 4000);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const createAppointmentSchema = zod_1.z.object({
    customerName: zod_1.z.string().trim().min(2, "customerName is required"),
    phoneNumber: zod_1.z.string().trim().min(8, "phoneNumber is required"),
    serviceName: zod_1.z.string().trim().min(2, "serviceName is required"),
    date: zod_1.z.string().regex(dateRegex, "date must be YYYY-MM-DD"),
    startTime: zod_1.z.string().regex(timeRegex, "startTime must be HH:MM"),
    durationMinutes: zod_1.z.number().int().positive().max(240).optional(),
    notes: zod_1.z.string().trim().max(300).optional()
});
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "booking-backend",
        now: new Date().toISOString()
    });
});
app.get("/appointments", (_req, res) => {
    res.json({
        data: (0, booking_service_1.listAppointments)()
    });
});
app.get("/services", (_req, res) => {
    res.json({
        data: (0, booking_service_1.listServices)()
    });
});
app.get("/customers", (_req, res) => {
    res.json({
        data: (0, booking_service_1.listCustomers)()
    });
});
app.get("/availability", (req, res) => {
    const date = String(req.query.date ?? "");
    const durationRaw = req.query.durationMinutes;
    const durationMinutes = durationRaw ? Number(durationRaw) : undefined;
    if (!dateRegex.test(date)) {
        return res.status(400).json({
            message: "date query is required in format YYYY-MM-DD"
        });
    }
    if (durationMinutes !== undefined && (!Number.isInteger(durationMinutes) || durationMinutes <= 0)) {
        return res.status(400).json({
            message: "durationMinutes must be a positive integer"
        });
    }
    return res.json({
        date,
        freeSlots: (0, booking_service_1.getAvailabilityByDate)(date, durationMinutes)
    });
});
app.post("/appointments", (req, res) => {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: parsed.error.flatten()
        });
    }
    try {
        const created = (0, booking_service_1.createAppointment)({
            ...parsed.data,
            startTime: parsed.data.startTime
        });
        return res.status(201).json({
            message: "Appointment created",
            data: created
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unable to create appointment";
        return res.status(409).json({
            message
        });
    }
});
app.use((_req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});
app.listen(port, () => {
    // Keep startup log minimal for local development.
    console.log(`Backend is running at http://localhost:${port}`);
});
