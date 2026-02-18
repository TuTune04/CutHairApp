# Phan tich Types va API can thiet o Frontend

Tai lieu nay tong hop hien trang type trong frontend, API da co cho booking backend, va de xuat bo API can thiet de frontend van hanh on dinh khi mo rong.

## 1) Hien trang type trong frontend

### 1.1 Nhom type danh muc dich vu (catalog)

Nguon:
- `frontend/src/types/service-catalog.ts`
- `frontend/src/types/catalog.ts`

Type chinh:
- `BasicService`, `ChemicalService`, `ServiceCard`, `ServiceMeta`
- `FeaturedService`, `HairStyleOption`, `HairGender`

Diem manh:
- Da tach type theo domain ro rang (service catalog, featured service, hairstyle).
- Co union type (`ServiceCard`) giup render card theo nhieu loai dich vu.

Han che hien tai:
- Nhieu truong gia dang `string` (vd `price`) thay vi number + currency.
- Chua co type cho response API (envelope, pagination, error model).
- Chua co type trang thai cho UI async (`loading`, `error`, `empty`, `success`).

### 1.2 Nhom type booking/admin

Nguon:
- `frontend/src/lib/booking-api.ts`

Type da co:
- `Appointment`
- `CustomerSummary`
- `CreateAppointmentPayload`

Danh gia:
- Da du de lam dashboard admin co ban.
- Can bo sung type chuan cho request query (`availability`) va response enveloped de dong nhat voi backend.

## 2) Hien trang API frontend da su dung

Nguon:
- `frontend/src/lib/booking-api.ts`
- `frontend/src/app/admin/page.tsx`

API da duoc wrap:
- `getAppointments(baseUrl)` -> `GET /appointments`
- `getCustomers(baseUrl)` -> `GET /customers`
- `getServices(baseUrl)` -> `GET /services` (gia lay tu backend seed theo `giatoc.md`)
- `createAppointment(baseUrl, payload)` -> `POST /appointments`
- `createExternalRevenue(baseUrl, payload)` -> `POST /external-revenues`
- `getDailyRevenue(baseUrl, from, to)` -> `GET /revenues/daily`
- `getMonthlyRevenue(baseUrl, year)` -> `GET /revenues/monthly`

Phan xu ly loi:
- Da co `readJsonResponse<T>()` de doc `message` tu backend.
- Backend da bo sung `errorCode` + `error` envelope de frontend xu ly loi domain.

## 3) Bo type de xuat chuan hoa frontend

Nen bo sung 1 file dung chung, vi du: `frontend/src/types/api.ts`

```ts
export interface ApiError {
  message: string
  errorCode?: string
  details?: unknown
}

export interface ApiSuccess<T> {
  data: T
  message?: string
}

export interface ApiList<T> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
  }
}

export type AsyncStatus = "idle" | "loading" | "success" | "error"
```

Domain booking nen tach rieng:
- `frontend/src/types/booking.ts`

```ts
export type TimeSlot = `${number}:${number}${number}`

export interface Appointment {
  id: string
  customerName: string
  phoneNumber: string
  serviceName: string
  date: string // YYYY-MM-DD
  startTime: TimeSlot
  endTime: TimeSlot
  notes?: string
  createdAt: string // ISO datetime
}

export interface CreateAppointmentPayload {
  customerName: string
  phoneNumber: string
  serviceName: string
  date: string
  startTime: TimeSlot
  durationMinutes: number
  notes?: string
}

export interface AvailabilityQuery {
  date: string
  durationMinutes: number
}
```

## 4) Cac API can thiet o frontend (uu tien theo giai doan)

### Giai doan 1 - Van hanh booking admin co ban

1. `GET /health`
   - Muc dich: Kiem tra backend online.
   - Frontend dung: hien thi trang thai ket noi trong admin.

2. `GET /appointments`
   - Muc dich: Lay danh sach lich hen.
   - Frontend dung: bang quan ly lich hen.

3. `GET /customers`
   - Muc dich: Tong hop nguoi da dat lich.
   - Frontend dung: bang thong ke khach hang.

4. `POST /appointments`
   - Muc dich: tao lich hen moi.
   - Frontend dung: form tao booking.

5. `POST /external-revenues`
   - Muc dich: ghi nhan don ngoai trong ngay (co the gom nhieu dich vu).
   - Frontend dung: popup doanh thu nhanh.

### Giai doan 2 - Day du CRUD cho admin

6. `GET /appointments/:id`
   - Xem chi tiet lich hen.

7. `PATCH /appointments/:id`
   - Cap nhat thong tin lich hen (gio, dich vu, ghi chu).

8. `DELETE /appointments/:id`
   - Huy lich hen.

9. `GET /appointments?date=&customerName=&phone=&service=&status=`
   - Loc va tim kiem lich hen tren dashboard.

### Giai doan 3 - Dong bo voi trang khach hang

10. `GET /services`
   - Chuyen du lieu dich vu dang hard-code sang backend.

11. `GET /catalog/categories`
   - Lay danh muc dich vu de loc tren UI.

12. `GET /catalog/services`
   - Lay catalog dich vu theo category.

13. `POST /newsletter/subscribe`
   - Luu dang ky nhan tin thay vi local state.

## 5) Quy uoc contract de frontend de dung lau dai

1. Dung response envelope thong nhat:
   - Success: `{ success: true, data, meta? }`
   - Error: `{ success: false, error: { code, message, details? } }`
   - Tuong thich tam thoi: payload loi van co `message` va `errorCode` de frontend cu khong vo.

2. Chuan hoa format:
   - `date`: `YYYY-MM-DD`
   - `datetime`: ISO string
   - `time`: `HH:MM` theo buoc 30 phut

3. Them version API:
   - De xuat duong dan `/api/v1/...` de tranh vo contract khi nang cap.

4. Bo sung ma loi domain:
   - `TIME_SLOT_UNAVAILABLE`
   - `OUTSIDE_WORKING_HOURS`
   - `VALIDATION_ERROR`
   - `SERVICE_NOT_AVAILABLE`
   - `NOT_FOUND`

5. CORS va env:
   - Frontend can `NEXT_PUBLIC_API_URL`.
   - Tach moi truong dev/staging/prod.

## 6) De xuat cau truc file frontend cho API layer

```txt
frontend/src/
  types/
    api.ts
    booking.ts
    catalog.ts
    service-catalog.ts
  lib/
    api/
      client.ts
      booking.ts
      catalog.ts
      newsletter.ts
```

Trong do:
- `client.ts`: base fetch, timeout, auth header, xu ly loi tap trung.
- Moi module (`booking.ts`, `catalog.ts`) chi khai bao ham domain.

## 7) Checklist implementation de doi frontend follow

- [ ] Tach type booking sang `src/types/booking.ts`
- [ ] Tao `src/types/api.ts` cho envelope + error
- [ ] Refactor `src/lib/booking-api.ts` thanh `src/lib/api/booking.ts`
- [ ] Them ham `pingHealth()` de check ket noi backend
- [ ] Hien thi ro loi domain theo `errorCode` tren UI admin
- [ ] Them API CRUD day du (`GET by id`, `PATCH`, `DELETE`)
- [ ] Chuyen dan du lieu hard-code (`services`) sang API catalog

## 8) Ket luan ngan

Frontend hien da co nen tang type kha tot cho phan giao dien va da ket noi duoc booking backend co ban. De mo rong an toan, can chuan hoa API contract (envelope + errorCode), tach type theo domain, va bo sung cac endpoint CRUD + catalog de giam phu thuoc du lieu hard-code.
