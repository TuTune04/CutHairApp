import { AppError } from "../errors";
import type { ServiceCategory, ServiceItem, UpdateServiceInput } from "../types";
import type { ServiceRepository } from "../repositories/database.repository";

export class CatalogService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  list(category?: ServiceCategory): ServiceItem[] {
    const rows = this.serviceRepository.list();
    const filtered = category ? rows.filter((item) => item.category === category) : rows;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  getById(id: string): ServiceItem {
    const found = this.serviceRepository.list().find((item) => item.id === id);
    if (!found) {
      throw new AppError("NOT_FOUND", "Service not found", 404);
    }
    return found;
  }

  listCategories(): ServiceCategory[] {
    const rows = this.serviceRepository.list();
    return [...new Set(rows.map((item) => item.category))];
  }

  create(input: ServiceItem): ServiceItem {
    const rows = this.serviceRepository.list();
    if (rows.some((item) => item.id === input.id)) {
      throw new AppError("CONFLICT", "Service id already exists", 409);
    }
    if (rows.some((item) => item.name.toLowerCase() === input.name.toLowerCase())) {
      throw new AppError("CONFLICT", "Service name already exists", 409);
    }
    this.serviceRepository.saveAll([...rows, input]);
    return input;
  }

  update(id: string, patch: UpdateServiceInput): ServiceItem {
    const rows = this.serviceRepository.list();
    const index = rows.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("NOT_FOUND", "Service not found", 404);
    }
    const next = { ...rows[index], ...patch };
    const nextRows = [...rows];
    nextRows[index] = next;
    this.serviceRepository.saveAll(nextRows);
    return next;
  }

  remove(id: string): ServiceItem {
    const rows = this.serviceRepository.list();
    const index = rows.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("NOT_FOUND", "Service not found", 404);
    }
    const nextRows = [...rows];
    const [removed] = nextRows.splice(index, 1);
    this.serviceRepository.saveAll(nextRows);
    return removed;
  }

  getByNameOrThrow(name: string): ServiceItem {
    const found = this.serviceRepository
      .list()
      .find((service) => service.name.toLowerCase() === name.trim().toLowerCase());
    if (!found) {
      throw new AppError("SERVICE_NOT_AVAILABLE", "Selected service is not available", 404);
    }
    return found;
  }
}
