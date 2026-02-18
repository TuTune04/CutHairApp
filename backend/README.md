# Backend - Booking Service

Backend don gian de quan ly lich hen cho CutHairApp.

## Chuc nang

- Tao lich hen moi
- Xem danh sach lich hen
- Xem danh sach nguoi da dat lich
- Xem khung gio trong theo ngay

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

### 1) Health check

- `GET /health`

### 2) Danh sach lich hen

- `GET /appointments`

### 3) Danh sach nguoi da dat lich

- `GET /customers`

### 4) Khung gio trong

- `GET /availability?date=2026-02-17`
- Optional: `durationMinutes`, vi du:
  - `GET /availability?date=2026-02-17&durationMinutes=60`

### 5) Tao lich hen

- `POST /appointments`
- Body JSON:

```json
{
  "customerName": "Le Minh",
  "phoneNumber": "0987654321",
  "serviceName": "Nhuom toc",
  "date": "2026-02-17",
  "startTime": "10:30",
  "durationMinutes": 60,
  "notes": "Khach moi"
}
```

Neu gio bi trung lich hoac ngoai gio lam viec (09:00 - 18:00), API se tra ve loi.
