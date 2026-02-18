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

3. **[TODO] He thong canh bao/quan sat khi phat sinh fallback seed**
   - Can them telemetry/log event ro rang de biet khi nao DB bi hu.
   - De xuat: ghi log co level + luu metadata vao `data/incident-log.json`.

## P1 - Bao mat va truy cap

4. **[TODO] Chua co auth cho admin API**
   - Anh huong: endpoint CRUD/revenue hien dang public.
   - De xuat:
     - Phase 1: API key cho admin routes.
     - Phase 2: JWT + role (`admin`, `staff`).
   - File lien quan: `backend/src/index.ts`.

5. **[TODO] CORS dang mo toan bo**
   - Anh huong: de bi goi API tu origin la.
   - De xuat: gioi han `origin` theo env (`ALLOWED_ORIGINS`).

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

9. **[TODO] Them quality gate trong CI**
   - De xuat: bat buoc pass `npm run test:run` + `npm run build` truoc merge.

## P3 - Van hanh va mo rong

10. **[TODO] Cau hinh hoa gio lam viec**
    - Hien dang hard-code `09:00 - 18:00`.
    - De xuat: dua ve env/config.

11. **[TODO] API versioning**
    - De xuat chuyen sang `/api/v1/...` de de dang nang cap contract.

---

## Thu tu trien khai de xuat (milestone)

- **Milestone A (an toan du lieu):** 1, 2, 3
- **Milestone B (bao mat):** 4, 5
- **Milestone C (chat luong nghiep vu):** 6, 7, 8
- **Milestone D (van hanh dai han):** 9, 10, 11
