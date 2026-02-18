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

## API

Tat ca API tra ve envelope:

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`

### 1) Health check

- `GET /health`

### 2) Appointment API

- `GET /appointments`
- `GET /appointments/:id`
- `POST /appointments`
- `PATCH /appointments/:id`
- `DELETE /appointments/:id`

### 3) Don ngoai

- `POST /external-revenues`
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

### 4) Khach hang va doanh thu

- `GET /customers`
- `GET /revenues/daily?from=2026-02-01&to=2026-02-29`
- `GET /revenues/monthly?year=2026`

### 5) Catalog dich vu

- `GET /services`
- `GET /catalog/categories`
- `GET /catalog/services?category=Dich%20vu%20le`
- `GET /catalog/services/:id`
- `POST /catalog/services`
- `PATCH /catalog/services/:id`
- `DELETE /catalog/services/:id`

### 6) Khung gio trong

- `GET /availability?date=2026-02-17`
- Optional: `durationMinutes`, vi du:
  - `GET /availability?date=2026-02-17&durationMinutes=60`

### 7) Vi du tao lich hen

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

Neu gio bi trung lich hoac ngoai gio lam viec (09:00 - 18:00), API se tra ve loi co `error.code`.

## Seed bang gia (dong bo tu frontend)

Gia seed trong `backend/src/database.ts` duoc dong bo theo `frontend/src/data/giatoc.md`, bao gom:

- Dich vu le: Cat/xa Nam, Cat/xa Nu, Goi, Tao kieu, Nhuom Nam, Lam line, Tay Nam, Uon Nam, Ep chan, Uon phong chan
- Hoa chat: Nhuom, Duoi/Ep, Uon, Tay Nu, Phuc hoi Keratin
- Phuc hoi: Hap/Phuc hoi Collagen
