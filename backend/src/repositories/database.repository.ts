import { readDatabase, writeDatabase } from "../database";
import type { Appointment, BookingDatabase, ServiceItem } from "../types";

export interface DatabaseRepository {
  read(): BookingDatabase;
  write(next: BookingDatabase): void;
}

export class FileDatabaseRepository implements DatabaseRepository {
  read(): BookingDatabase {
    return readDatabase();
  }

  write(next: BookingDatabase): void {
    writeDatabase(next);
  }
}

export interface AppointmentRepository {
  list(): Appointment[];
  saveAll(rows: Appointment[]): void;
}

export interface ServiceRepository {
  list(): ServiceItem[];
  saveAll(rows: ServiceItem[]): void;
}

export class JsonAppointmentRepository implements AppointmentRepository {
  constructor(private readonly db: DatabaseRepository) {}

  list(): Appointment[] {
    return this.db.read().appointments;
  }

  saveAll(rows: Appointment[]): void {
    const current = this.db.read();
    this.db.write({
      ...current,
      appointments: rows
    });
  }
}

export class JsonServiceRepository implements ServiceRepository {
  constructor(private readonly db: DatabaseRepository) {}

  list(): ServiceItem[] {
    return this.db.read().services;
  }

  saveAll(rows: ServiceItem[]): void {
    const current = this.db.read();
    this.db.write({
      ...current,
      services: rows
    });
  }
}
