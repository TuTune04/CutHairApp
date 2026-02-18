# Backend - Booking Service

Backend don gian de quan ly lich hen cho CutHairApp.

## Chuc nang

- Tao lich hen moi
- CRUD lich hen (xem chi tiet, sua, xoa)
- Xem danh sach lich hen
- Xem danh sach nguoi da dat lich
- Ghi nhan don ngoai (doanh thu trong ngay, nhieu dich vu)
- Catalog dich vu + category
- Tong ket doanh thu theo ngay/thang

## Cai dat

```bash
cd backend
npm install
```

## Chay local

```bash
npm run dev
```

Server mac dinh: `http://localhost:4000`

Bien moi truong quan trong:
- `PORT` (mac dinh `4000`)
- `SHOP_OPEN_HOUR` (mac dinh `9`)
- `SHOP_CLOSE_HOUR` (mac dinh `18`)
- `MAX_CONCURRENT_APPOINTMENTS` (mac dinh `2`, so lich hen app co the trung mot khung gio)
- `ALLOWED_ORIGINS` (danh sach origin CORS, tach boi dau phay)
- `ADMIN_API_KEY` (tuy chon, neu dat thi cac endpoint admin se yeu cau header `x-admin-api-key`)
- `ADMIN_USERNAME` + `ADMIN_PASSWORD` (tuy chon, bat dang nhap tai khoan admin)
- `ADMIN_TOKEN_TTL_MINUTES` (mac dinh `720`, thoi gian song cua bearer token)
- `ADMIN_AUTH_SECRET` (tuy chon, bi mat ky token admin)
- `BOOKING_DB_PATH` (tuy chon, de doi vi tri file DB)

Tai khoan admin mau de test nhanh:
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=admin123456`

## API

Tat ca API tra ve envelope:

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`

Versioning:
- API chinh thuc: `/api/v1/*`.
- Du an da chuyen sang router versioned va khong con phu thuoc route legacy.

### 1) Health check

- `GET /api/v1/health`

### 2) Admin Auth

- `POST /api/v1/auth/admin/login`
- Body JSON:

```json
{
  "username": "admin",
  "password": "your-password"
}
```

Tra ve:
- `accessToken` (Bearer token de goi API admin)
- `tokenType` = `Bearer`
- `expiresInSeconds`

### 3) Appointment API

- `GET /api/v1/appointments`
- `GET /api/v1/appointments/:id`
- `POST /api/v1/appointments`
- `PATCH /api/v1/appointments/:id`
- `DELETE /api/v1/appointments/:id`

Luu y phan quyen:
- `POST /api/v1/appointments` la endpoint dat lich cong khai (khong can admin key).
- Cac endpoint appointment con lai yeu cau quyen admin: `x-admin-api-key` hoac `Authorization: Bearer <token>`.

Rule cap nhat `source`:
- Neu `source = "external"`: he thong se force `startTime = "00:00"` va `endTime = "00:00"` (ban ghi doanh thu, khong phai khung gio lich hen).
- Neu chuyen nguoc lai `source = "app"`: can gui `startTime` (va co the gui `durationMinutes`) de he thong tinh lai `endTime` va check trung lich.

### 4) Don ngoai

- `POST /api/v1/external-revenues`
- Body JSON:

```json
{
  "phoneNumber": "0987654321",
  "date": "2026-02-17",
  "serviceNames": ["Cat, xa toc Nam", "Goi Nam/Nu"],
  "totalRevenue": 80000,
  "notes": "Khach vao truc tiep"
}
```

### 5) Khach hang va doanh thu

- `GET /api/v1/customers`
- `GET /api/v1/revenues/daily?from=2026-02-01&to=2026-02-29`
- `GET /api/v1/revenues/monthly?year=2026`

Luu y phan quyen:
- Cac endpoint tren yeu cau quyen admin: `x-admin-api-key` hoac `Authorization: Bearer <token>`.

### 6) Catalog dich vu

- `GET /api/v1/services`
- `GET /api/v1/catalog/categories`
- `GET /api/v1/catalog/services?category=Dich%20vu%20le`
- `GET /api/v1/catalog/services/:id`
- `POST /api/v1/catalog/services`
- `PATCH /api/v1/catalog/services/:id`
- `DELETE /api/v1/catalog/services/:id`

Luu y phan quyen:
- Read endpoints catalog la cong khai.
- Write endpoints catalog (`POST/PATCH/DELETE`) yeu cau quyen admin: `x-admin-api-key` hoac `Authorization: Bearer <token>`.

### 7) Khung gio trong

- `GET /api/v1/availability?date=2026-02-17`
- Optional: `durationMinutes`, vi du:
  - `GET /api/v1/availability?date=2026-02-17&durationMinutes=60`

### 8) Vi du tao lich hen

```json
{
  "customerName": "Le Minh",
  "phoneNumber": "0987654321",
  "serviceName": "Nhuom Nam",
  "date": "2026-02-17",
  "startTime": "10:30",
  "durationMinutes": 60,
  "notes": "Khach moi"
}
```

Neu khung gio da day theo `MAX_CONCURRENT_APPOINTMENTS` hoac ngoai gio lam viec (`SHOP_OPEN_HOUR` - `SHOP_CLOSE_HOUR`), API se tra ve loi co `error.code`.

## Quality gate (CI)

Da cau hinh workflow tai `.github/workflows/quality-gate.yml`:
- Backend: `npm ci` -> `npm run build` -> `npm run test:run`
- Frontend: `npm ci` -> `npm run build` -> `npm run test:run` -> `npm run lint`

## Cau truc MVC hien tai

```txt
backend/src/
  controllers/
  routes/
  services/
  repositories/
  validators/
  utils/
  index.ts
```

Tai lieu mo rong chi tiet:
- `backend/EXTENDING_BACKEND.md` (huong dan mo rong tung lop, checklist, quy trinh them feature moi)
- `backend/data/incident-log.json` (duoc tao tu dong khi fallback seed do DB parse loi)

## Seed bang gia (dong bo tu frontend)

Gia seed trong `backend/src/database.ts` duoc dong bo theo `frontend/src/data/giatoc.md`, bao gom:

- Dich vu le: Cat/xa Nam, Cat/xa Nu, Goi, Tao kieu, Nhuom Nam, Lam line, Tay Nam, Uon Nam, Ep chan, Uon phong chan
- Hoa chat: Nhuom, Duoi/Ep, Uon, Tay Nu, Phuc hoi Keratin
- Phuc hoi: Hap/Phuc hoi Collagen
