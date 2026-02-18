# Extending Backend Guide

Tai lieu nay huong dan mo rong backend theo tung lop MVC hien tai.

## 1) Kien truc tong quan

```txt
backend/src/
  routes/        # Dinh tuyen endpoint
  controllers/   # HTTP handler (request/response)
  validators/    # Zod schema + validate query/body
  services/      # Logic nghiep vu
  repositories/  # Truy cap du lieu
  utils/         # Ham dung chung
  types/         # DTO va domain type
  container.ts   # Wiring dependency
  index.ts       # Bootstrap app
```

Nguyen tac:
- `route` khong chua business logic.
- `controller` khong truy cap DB truc tiep.
- `service` khong biet Express.
- `repository` la noi duy nhat doc/ghi data.

## 2) Muon them 1 feature moi, lam theo thu tu nao?

1. Them type trong `src/types/*` neu can.
2. Them validator trong `src/validators/*`.
3. Them/doi logic nghiep vu trong `src/services/*`.
4. Them endpoint handler trong `src/controllers/*`.
5. Dang ky route trong `src/routes/*` va `src/routes/api-v1.routes.ts`.
6. Neu can du lieu moi, cap nhat `src/repositories/*` va/hoac `src/database.ts`.
7. Bo sung test:
   - Unit: service/pure function.
   - Integration: endpoint `/api/v1/*`.

## 3) Mo rong theo tung phan

### 3.1 Appointments / Booking rules

File chinh:
- `src/services/appointment.service.ts`
- `src/controllers/appointments.controller.ts`
- `src/validators/appointment.validator.ts`

Khi thay doi rule dat lich:
- Sua mot cho trong `AppointmentService` (`assertNoConflict`, `assertWorkingHours`, `update/create`).
- Khong duplicate rule o controller.
- Them test unit cho rule moi + test integration cho endpoint.

### 3.2 Catalog services

File chinh:
- `src/services/catalog.service.ts`
- `src/controllers/catalog.controller.ts`
- `src/validators/service.validator.ts`

Khi them rang buoc gia/danh muc:
- Dat logic trong `CatalogService`.
- Validator chi kiem tra format/input shape.

### 3.3 Customer analytics

File chinh:
- `src/services/customer-analytics.service.ts`

Ham `buildCustomerSummaries()` la pure function:
- De test edge cases (trung so, doi ten, merge lich su).
- Uu tien sua function nay khi can doi quy tac gom nhom.

### 3.4 Revenue analytics

File chinh:
- `src/services/revenue-analytics.service.ts`

Ham pure:
- `buildDailyRevenue()`
- `buildMonthlyRevenue()`

Neu thay doi cach thong ke, sua tai day va giu controller mong.

### 3.5 Data layer / repository

File chinh:
- `src/repositories/database.repository.ts`
- `src/database.ts`

Neu doi storage (SQLite/Postgres):
- Tao repository implementation moi.
- Giu interface repository khong doi.
- Wiring lai trong `src/container.ts`.

## 4) Quy tac coding khi mo rong

- Khong goi `readDatabase()` truc tiep trong service/controller moi.
- Khong parse/format response envelope trong service.
- Khong bo qua validator o route moi.
- Tat ca endpoint moi dung prefix `/api/v1`.

## 5) Checklist truoc khi merge

- [ ] `npm run build` (backend) pass
- [ ] `npm run test:run` (backend) pass
- [ ] Co test cho rule moi (it nhat 1 unit + 1 integration neu co endpoint)
- [ ] README/API docs duoc cap nhat neu thay doi contract

## 6) Mau them endpoint nhanh

Vi du them endpoint `GET /api/v1/metrics/summary`:

1. Tao service `src/services/metrics.service.ts`.
2. Tao controller `src/controllers/metrics.controller.ts`.
3. Tao route `src/routes/metrics.routes.ts`.
4. Mount vao `src/routes/api-v1.routes.ts`:
   - `apiV1Router.use("/metrics", metricsRouter)`
5. Them test trong `backend/tests/http-integration.test.ts`.
