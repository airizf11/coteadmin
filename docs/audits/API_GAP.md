# 🔌 API Gap Analysis — cotebek ↔ coteadmin

> Endpoint/fitur yang **sudah ada di cotebek** tapi **belum (atau baru sebagian) dipakai coteadmin**.
> Metode: bandingkan semua controller cotebek vs semua call `cotebek()` / fetch di src coteadmin.
> Tanggal scan: 2026-08-26. Centang saat fitur sudah diimplementasikan di UI.

## 🔴 Fungsional — ada lubang nyata

- [ ] **Approve anggota yang PENDING** — `PUT /apps/:appId/members/:userId/approve` (OWNER)
  - Halaman teams menampilkan `m.status` tapi **tidak ada tombol approve**. Staf yang join lewat api-key akan selamanya pending. Tambahkan aksi approve di daftar "Anggota Aktif" (filter status PENDING).

- [ ] **Edit bahan/barang (raw-materials)** — `PUT /raw-materials/:id` (OWNER/ADMIN)
  - Frontend hanya punya create (`actions.tsx`) + list. Belum ada form edit/nonaktifkan bahan.

- [ ] **Cari pelanggan by phone (server-side)** — `GET /customers/search/phone?phone=`
  - CustomerPicker tampaknya filter client-side dari `GET /customers`. Untuk ribuan pelanggan, pindahkan ke endpoint search ini.

## 🟡 Modul utuh belum tersentuh

- [x] **App Submissions** (alur pengajuan buka usaha) — **✅ TERNYATA SUDAH DI-IMPLEMENTASI, di `coteweb` bukan coteadmin:**
  - `POST /app-submissions` → coteweb `/onboarding` (submitOnboarding)
  - `GET /app-submissions/pending` + `POST /:id/approve|reject` → coteweb `/internal/submissions` (panel superadmin)
  - ➡️ Status: **N/A untuk coteadmin** — biarkan di coteweb.

- [ ] **Join usaha via API key** — `POST /apps/join` (staf minta gabung)
  - Tidak dipakai di ketiga repo (coteadmin/coteweb dicek). Alur staf saat ini: owner kirim **invite email** → staf login Google. Endpoint ini kemungkinan legacy — putuskan: implement atau hapus dari backend.

- [x] **Self-serve buat usaha** — `POST /apps/self-serve` — ✅ alurnya jalan via **coteweb `/internal/apps`**: superadmin `POST /apps` untuk klien + invite OWNER email (`createClientApp`). `POST /apps/self-serve` sendiri tetap belum dipakai di mana pun (kandidat dihapus atau dipakai coteweb onboarding nanti).

## 🟢 Reports yang belum dipakai (kandidat halaman baru)

- [ ] `GET /reports/adjustments` — penyesuaian kas (semua role)
- [ ] `GET /reports/top-customers` — OWNER/ADMIN
- [ ] `GET /reports/customer-demographics` — OWNER/ADMIN (pasangkan dengan data gender yang sudah dikumpulkan!)
- [ ] `GET /reports/staff-activity` — aktivitas per staf, OWNER/ADMIN
- [ ] `GET /reports/expense-summary` — ringkasan pengeluaran, OWNER/ADMIN

## ⚪ Kecil / opsional

- [ ] `GET /orders/active` — order non-DONE urut jatuh tempo (0 pemakaian; dashboard saat ini pakai `/reports/staff-dashboard` + `/overview`). Berguna untuk widget "perlu ditindak".
- [ ] `GET /users/me/apps` — masih devtest saja; kandidat fitur multi-usaha (switcher).
- [ ] `includeInactive=true` items sudah dipakai di items/page ✓ (tidak gap — catatan saja).

## ✅ Sudah ter-cover penuh (tidak perlu aksi)

auth (login/google/refresh/logout/membership), apps me+members+invites+invite+remove, orders (CRUD+status+pay+receipt+track×2), customers CRUD, items CRUD+toggle, transactions (list/create/pay/detail), promos CRUD+check+toggle, reports inti (summary/top-items/sales-trend/payment-methods/overview/status-breakdown/staff-dashboard/promo-budget/net-profit/expense-by-category/**export xlsx-pdf** via ExportButton), attachments (upload/list/view/download/delete via proxy routes), team-members add+list, app-settings (bulk upsert + public branding), audit-logs.

---
*Update `docs/reference/api-contract.md` tetap jadi acuan detail tiap endpoint.*
</content>
</invoke>