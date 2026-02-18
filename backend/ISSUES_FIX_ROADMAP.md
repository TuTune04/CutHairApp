# Backend Issues Fix Roadmap

Tai lieu nay tong hop cac van de quan trong theo thu tu uu tien de fix, dong thoi danh dau nhung muc da duoc xu ly.

## P0 - Du lieu va do tin cay

1. **[DONE] Nguy co mat du lieu khi DB parse loi**
   - Trieu chung: file `booking-db.json` hong se bi reset ve seed.
   - Da fix:
     - Backup file hong sang `booking-db.corrupted.<timestamp>.json`.
     - Sau do moi tao lai seed de he thong tiep tuc chay.
   - File lien quan: `backend/src/database.ts`.

2. **[DONE] Race condition khi ghi DB (ghi chong du lieu)**
   - Trieu chung: nhieu luong ghi co the de len nhau.
   - Da fix:
     - Them write lock bang lock directory (`booking-db.json.lock`) co timeout.
     - Them stale lock cleanup.
     - Ghi file atomic qua `.tmp` + `rename`.
   - File lien quan: `backend/src/database.ts`.

3. **[DONE] He thong canh bao/quan sat khi phat sinh fallback seed**
   - Da fix:
     - Ghi su kien incident khi DB parse loi va fallback seed.
     - Luu metadata vao `data/incident-log.json` (event, level, time, paths lien quan).
   - File lien quan: `backend/src/database.ts`, `backend/src/incident-log.ts`.

## P1 - Bao mat va truy cap

4. **[DONE] Chua co auth cho admin API**
   - Da fix phase 1:
     - API key middleware cho admin routes (`x-admin-api-key`).
     - Co che bat/tat theo env `ADMIN_API_KEY` (khong set => khong enforce, de de migration).
   - File lien quan: `backend/src/middlewares/admin-api-key.middleware.ts`, `backend/src/routes/*`.

5. **[DONE] CORS dang mo toan bo**
   - Da fix:
     - Gioi han CORS theo env `ALLOWED_ORIGINS`.
     - Co default local origins de khong vo luong dev.
   - File lien quan: `backend/src/index.ts`, `backend/src/config.ts`.

## P1 - Data validation va business rule

6. **[DONE] Validate ngay/gio moi dung regex, chua validate semantic**
   - Vi du: ngay khong ton tai van co the qua schema format.
   - Da fix: bo sung semantic date validation (calendar day) cho body va query date.
   - File lien quan: `backend/src/index.ts`.

7. **[DONE] Lam ro rule update appointment khi doi source**
   - Hien tai khi `source = external` se force `00:00`.
   - Da fix:
     - Bo sung docs rule cap nhat source trong README.
     - Them test case update qua lai `app <-> external` (unit + integration).
   - File lien quan: `backend/src/booking-service.ts`, `backend/tests/*`, `backend/README.md`.

## P2 - Test va quality gate

8. **[DONE] Test da co, nhung chua du bao phu integration thuc te**
   - Da co:
     - Unit test business service.
     - HTTP contract test (mock service).
     - Integration test end-to-end voi DB test rieng (khong mock service).
   - Da bo sung:
     - Regression test cho availability, revenue, service CRUD.
     - Test semantic date validation va source transition trong integration suite.
   - File lien quan: `backend/tests/http-integration.test.ts`.

9. **[DONE] Them quality gate trong CI**
   - Da fix: tao workflow `.github/workflows/quality-gate.yml`.
   - Quality gate:
     - Backend: `npm run build` + `npm run test:run`.
     - Frontend: `npm run build` + `npm run test:run` + `npm run lint`.

## P3 - Van hanh va mo rong

10. **[DONE] Cau hinh hoa gio lam viec**
    - Da fix: dua `SHOP_OPEN_HOUR`/`SHOP_CLOSE_HOUR` vao `backend/src/config.ts`.
    - Co validation env de tranh config loi.
    - Cap nhat `.env.example` va README.

11. **[DONE] API versioning**
    - Da fix: publish route versioned `/api/v1/*`.
    - Van giu route cu de migration an toan, khong gay vo frontend hien tai.
    - File lien quan: `backend/src/index.ts`.

---

## Thu tu trien khai de xuat (milestone)

- **Milestone A (an toan du lieu):** 1, 2, 3
- **Milestone B (bao mat):** 4, 5
- **Milestone C (chat luong nghiep vu):** 6, 7, 8
- **Milestone D (van hanh dai han):** 9, 10, 11
