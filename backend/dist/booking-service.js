"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAppointments = listAppointments;
exports.listServices = listServices;
exports.listCustomers = listCustomers;
exports.getAvailabilityByDate = getAvailabilityByDate;
exports.createAppointment = createAppointment;
const node_crypto_1 = require("node:crypto");
const database_1 = require("./database");
const SHOP_OPEN_HOUR = 9;
const SHOP_CLOSE_HOUR = 18;
const SLOT_STEP_MINUTES = 30;
const DEFAULT_DURATION_MINUTES = 60;
function parseMinutes(time) {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}
function formatMinutes(totalMinutes) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const hourText = String(hour).padStart(2, "0");
    const minuteText = String(minute).padStart(2, "0");
    return `${hourText}:${minuteText}`;
}
function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
}
function compareDateTime(date, time) {
    return new Date(`${date}T${time}:00`).getTime();
}
function listAppointments() {
    const db = (0, database_1.readDatabase)();
    return [...db.appointments].sort((a, b) => {
        return compareDateTime(a.date, a.startTime) - compareDateTime(b.date, b.startTime);
    });
}
function listServices() {
    const db = (0, database_1.readDatabase)();
    return [...db.services].sort((a, b) => a.name.localeCompare(b.name));
}
function listCustomers() {
    const db = (0, database_1.readDatabase)();
    const grouped = new Map();
    for (const item of db.appointments) {
        const key = `${item.customerName}|${item.phoneNumber}`;
        const candidateAt = new Date(`${item.date}T${item.startTime}:00`).toISOString();
        const existing = grouped.get(key);
        if (!existing) {
            grouped.set(key, {
                customerName: item.customerName,
                phoneNumber: item.phoneNumber,
                totalAppointments: 1,
                latestAppointmentAt: candidateAt,
                servicesUsed: [item.serviceName],
                bookingHistory: [
                    {
                        appointmentId: item.id,
                        serviceName: item.serviceName,
                        date: item.date,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        createdAt: item.createdAt
                    }
                ]
            });
            continue;
        }
        existing.totalAppointments += 1;
        if (!existing.servicesUsed.includes(item.serviceName)) {
            existing.servicesUsed.push(item.serviceName);
        }
        existing.bookingHistory.push({
            appointmentId: item.id,
            serviceName: item.serviceName,
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            createdAt: item.createdAt
        });
        if (new Date(candidateAt) > new Date(existing.latestAppointmentAt)) {
            existing.latestAppointmentAt = candidateAt;
        }
    }
    for (const customer of grouped.values()) {
        customer.bookingHistory.sort((a, b) => compareDateTime(b.date, b.startTime) - compareDateTime(a.date, a.startTime));
    }
    return [...grouped.values()].sort((a, b) => b.totalAppointments - a.totalAppointments);
}
function getAvailabilityByDate(date, durationMinutes = DEFAULT_DURATION_MINUTES) {
    const db = (0, database_1.readDatabase)();
    const dayAppointments = db.appointments.filter((item) => item.date === date);
    const openMinutes = SHOP_OPEN_HOUR * 60;
    const closeMinutes = SHOP_CLOSE_HOUR * 60;
    const lastStart = closeMinutes - durationMinutes;
    const freeSlots = [];
    for (let start = openMinutes; start <= lastStart; start += SLOT_STEP_MINUTES) {
        const end = start + durationMinutes;
        const isBusy = dayAppointments.some((item) => {
            const busyStart = parseMinutes(item.startTime);
            const busyEnd = parseMinutes(item.endTime);
            return overlaps(start, end, busyStart, busyEnd);
        });
        if (!isBusy) {
            freeSlots.push(formatMinutes(start));
        }
    }
    return freeSlots;
}
function createAppointment(input) {
    const db = (0, database_1.readDatabase)();
    const normalizedServiceName = input.serviceName.trim();
    const selectedService = db.services.find((service) => service.name.toLowerCase() === normalizedServiceName.toLowerCase());
    if (!selectedService) {
        throw new Error("Selected service is not available");
    }
    const durationMinutes = input.durationMinutes ?? selectedService.defaultDurationMinutes ?? DEFAULT_DURATION_MINUTES;
    const startMinutes = parseMinutes(input.startTime);
    const endMinutes = startMinutes + durationMinutes;
    const openMinutes = SHOP_OPEN_HOUR * 60;
    const closeMinutes = SHOP_CLOSE_HOUR * 60;
    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
        throw new Error("Selected time is outside working hours");
    }
    const dayAppointments = db.appointments.filter((item) => item.date === input.date);
    const hasConflict = dayAppointments.some((item) => {
        const busyStart = parseMinutes(item.startTime);
        const busyEnd = parseMinutes(item.endTime);
        return overlaps(startMinutes, endMinutes, busyStart, busyEnd);
    });
    if (hasConflict) {
        throw new Error("Selected time is no longer available");
    }
    const nextAppointment = {
        id: (0, node_crypto_1.randomUUID)(),
        customerName: input.customerName,
        phoneNumber: input.phoneNumber,
        serviceName: selectedService.name,
        date: input.date,
        startTime: input.startTime,
        endTime: formatMinutes(endMinutes),
        notes: input.notes,
        createdAt: new Date().toISOString()
    };
    db.appointments.push(nextAppointment);
    (0, database_1.writeDatabase)(db);
    return nextAppointment;
}
