# 🔍 UI Consistency Audit — coteadmin

> **Cara pakai:** centang `- [x]` pada item yang sudah diperbaiki. Item dikelompokkan per prioritas.
> Audit dibuat dari scan otomatis + review manual terhadap semua file `.tsx` di `src/`.

---

## 📖 Konvensi yang Direkomendasikan (acuan perbaikan)

### 1. Mapping warna hardcoded → design token

| ❌ Jangan                                                   | ✅ Pakai                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `text-gray-400/500/600`                                     | `text-muted-foreground`                                                   |
| `bg-gray-100 text-gray-700 border-gray-200`                 | `bg-muted text-muted-foreground border-border`                            |
| `bg-gray-200 text-gray-600` (badge nonaktif)                | `bg-muted text-muted-foreground`                                          |
| `bg-black text-white` (tombol)                              | `<Button>` atau `buttonVariants()` (`bg-primary text-primary-foreground`) |
| `bg-green-600 hover:bg-green-700` / `bg-emerald-600`        | `bg-success hover:bg-success/90 text-success-foreground`                  |
| `text-red-500`                                              | `text-destructive`                                                        |
| `bg-emerald-*` (status selesai/lunas)                       | `bg-success/10 text-success border-success/20`                            |
| `bg-blue-100 text-blue-700 border-blue-200`                 | `bg-info/10 text-info border-info/20`                                     |
| `bg-yellow-*/orange-*` (pending/warning)                    | `bg-warning/10 text-warning border-warning/20`                            |
| `bg-slate-950 text-slate-300 border-slate-800` (code block) | boleh dipertahankan, tapi idealnya jadi 1 pola util bersama               |

**Pola badge status yang disarankan (satu untuk semua):**

```
bg-{token}/10 text-{token} border-{token}/20
```

Contoh: `bg-success/10 text-success border-success/20`, `bg-destructive/10 text-destructive border-destructive/20`

### 2. Hierarki judul halaman (h1)

| Tipe halaman                         | Class h1                                                        |
| ------------------------------------ | --------------------------------------------------------------- |
| List utama (Orders, Items, dst)      | `text-2xl font-heading font-bold text-primary tracking-tight`   |
| Detail / Form (Order [id], Tambah X) | `text-xl font-heading font-bold text-foreground tracking-tight` |
| Subtitle (opsional)                  | `text-sm text-muted-foreground mt-1`                            |

### 3. Padding container

Layout `(app)/layout.tsx` sudah kasih `pb-20` di wrapper untuk clear bottom-nav.
➡️ **Standarkan container halaman = `p-4` saja**, hapus variasi `pb-24` / `pb-8` / tanpa-pb kecuali memang butuh ekstra scroll space.

### 4. Tombol

- Selalu pakai komponen `<Button>` atau `buttonVariants()` — jangan raw `<button>`/`<Link>` dengan class warna manual.
- Ikon-only action boleh raw `<button>` tapi wajib pakai token (`text-destructive hover:bg-destructive/10` ✅ contoh di `DeleteButton.tsx`).

---

## 🔴 PRIORITAS TINGGI — Halaman user-facing, warna hardcoded (belang di dark mode)

- [x] `src/app/(app)/teams/page.tsx`
  - `text-gray-500`, `text-gray-600`, `text-gray-400` → `text-muted-foreground`
  - Badge "Pending": `bg-yellow-100 text-yellow-700` → `bg-warning/10 text-warning`
  - h1 tidak konsisten: ada `text-lg font-semibold mb-2` DAN `mb-4` di file yang sama
  - Container: `p-4` vs `p-4 pb-8` campur dalam satu file

- [x] `src/app/(app)/promos/page.tsx`
  - Link "+ Buat" pakai `bg-black text-white px-3 py-1.5 rounded-lg` → ganti `<Button size="sm">`
  - `text-gray-500`, `active:bg-gray-50`, badge `bg-gray-200 text-gray-600`
  - h1 `text-lg font-semibold` tanpa warna & bukan gaya list utama
  - Container `p-4` tanpa padding bawah konsisten

- [x] `src/app/(app)/orders/[id]/OrderActionButtons.tsx`
  - `bg-green-600 hover:bg-green-700 text-white` → `bg-success hover:bg-success/90`

- [x] `src/app/(app)/orders/[id]/receipt/ReceiptWaButton.tsx`
  - `bg-green-600 hover:bg-green-700 text-white` → `bg-success hover:bg-success/90`

- [x] `src/app/(app)/new/tx/page.tsx`
  - Toggle IN: `bg-emerald-600 hover:bg-emerald-700` → `bg-success hover:bg-success/90`
  - (Catatan: ini juga beda dengan `green-600` yang dipakai di orders — dua "hijau" berbeda)

- [x] `src/app/(app)/customers/[id]/page.tsx`
  - `STATUS_CONFIG`: fallback `bg-gray-100 text-gray-700 border-gray-200`, `RECEIVED` biru `bg-blue-100…`, `DONE` `bg-emerald-100…` → konversi semua ke pola token (`bg-muted…`, `bg-info/10…`, `bg-success/10…`)
  - Kartu catatan kuning: `bg-yellow-50/50 border-yellow-100`, `text-yellow-700`, `text-yellow-900` → token `warning` (mis. `bg-warning/5 border-warning/20 text-warning`)

- [x] `src/app/(app)/customers/page.tsx`
  - Gender avatar: `bg-blue-100 text-blue-600 border-l-blue-400` / `bg-pink-100 …` → tidak dark-aware; pertimbangkan token atau pola `/10 + dark:`
  - Tombol WA hijau: `text-green-600 hover:text-green-700 hover:bg-green-50` → `text-success hover:bg-success/10`

- [x] `src/app/(app)/orders/[id]/page.tsx`
  - Badge "Lunas": `bg-emerald-50 text-emerald-700 border-emerald-200` → `bg-success/10 text-success border-success/20`
  - Baris diskon: `text-emerald-600` → `text-success`

- [x] `src/app/(app)/transactions/MarkPaidInline.tsx`
  - Semua orange: `border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800`, `text-orange-600` → token `warning`

- [x] `src/app/(app)/reports/advanced/FilterForm.tsx`
  - `border-orange-200 focus-visible:ring-orange-500`, `text-orange-500` → token `warning` / `ring-ring`

- [x] `src/app/(app)/transactions/FilterForm.tsx`
  - `text-emerald-600` (IN) → `text-success` (biar sepasang simetris dengan OUT yang sudah `text-destructive` ✅)

---

## 🟡 PRIORITAS SEDANG — Konsistensi judul, padding, tombol

### Judul halaman (h1) tidak mengikuti konvensi

- [ ] `src/app/(app)/items/[id]/page.tsx` — `text-lg font-semibold mb-4` (tanpa warna) → gaya detail: `text-xl font-heading font-bold text-foreground tracking-tight`
- [ ] `src/app/(app)/promos/[id]/page.tsx` — sama seperti di atas
- [ ] `src/app/(app)/customers/[id]/edit/page.tsx` — `text-lg font-semibold mb-4` (tanpa warna)
- [x] `src/app/(app)/teams/page.tsx` — `text-lg font-semibold mb-4` (tanpa warna)
- [ ] `src/app/(app)/attachments/page.tsx` — `text-lg font-semibold … mb-1` (gaya beda sendiri)
- [ ] `src/app/(app)/transactions/[id]/page.tsx` — `text-lg font-semibold … mb-1`
- [ ] `src/app/(app)/new/upload/page.tsx` — `text-lg font-semibold … mb-1`
- [ ] `src/app/(app)/items/new/page.tsx`, `customers/new/page.tsx`, `raw-materials/new/page.tsx`, `promos/new/page.tsx`, `profile/page.tsx` — `text-lg font-semibold … mb-4` → putuskan: naikkan ke gaya detail (`text-xl`) atau biarkan sebagai tier ketiga yang konsisten di SEMUA form

### Padding container campur aduk (`pb-24` / `pb-8` / tanpa pb)

> Layout sudah kasih `pb-20`. Pilih satu strategi lalu seragamkan:

- [ ] Kelompok `pb-24` (kemungkinan dobel dengan layout): `attachments`, `customers`, `transactions`, `items`, `audit-logs`, `settings`, `more`, `new/page`, `new/upload`, `new/tx`, `orders`, `orders/[id]`, `new/orders`, `customers/[id]`
- [ ] Kelompok `pb-8`: `transactions/[id]`, `customers/[id]/edit`, `customers/new`, `teams`, `promos/new`, `promos/[id]`
- [ ] Tanpa pb eksplisit: `items/[id]`, `items/new`, `raw-materials`, `raw-materials/new`, `promos`, `profile`, `reports/advanced`

### Raw button / link bergaya tombol

- [ ] `src/app/(app)/error.tsx` — raw `<button>` dengan class manual `bg-primary text-primary-foreground rounded-lg px-4 py-2 …` → `<Button>`
- [ ] `src/app/(app)/NoAccessScreen.tsx` — cek raw `<button type="submit">` → `<Button>`
- [x] `src/app/promos/page.tsx` — link "+ Buat" (sudah tercatat di prioritas tinggi)

---

## 🟢 PRIORITAS RENDAH — Internal / dev tooling (boleh dilewati)

- [ ] `src/components/printlab/PrintLab.tsx` — full hardcoded (`bg-blue-600`, `bg-red-600`, `bg-gray-800`, `bg-green-600`, `bg-purple-600`, `bg-black text-green-400`, `bg-gray-50`). Tool internal, tapi kalau mau rapi: `info`, `destructive`, `secondary`, `success`, `accent`, dan log pakai `bg-foreground text-background`.
- [ ] `src/app/devtest/items/page.tsx` — `bg-gray-100`, `text-red-500`
- [ ] `src/app/devtest/apikeys/page.tsx` — `bg-gray-100`, `text-red-500`
- [ ] `src/app/devtest/apikeys/CreateAppForm.tsx` — tombol `bg-black text-white`, `text-red-500`
- [ ] `src/app/devtest/transactions/page.tsx` — `bg-gray-100`, `text-red-500`

---

## 🧹 BONUS — Kebersihan repo

- [ ] Hapus file backup: `globals.css.b00`, `globals.css.b001`, `layout.tsx.b00`, `page.tsx.b00` (root app), `login/page.tsx.b00`, `printlab/PrintLab.tsx.b00`, `printes/page.tsx.1` — git history sudah cukup sebagai backup
- [ ] Tambahkan `*.b00`, `*.b001`, `*.1` ke `.gitignore`

---

## ✅ Contoh yang SUDAH bagus (jadi acuan)

- `src/app/(app)/orders/OrderFilterBar.tsx` — filter chips full token (`bg-success`, `bg-destructive`, `border-border`)
- `src/app/(app)/attachments/DeleteButton.tsx` — ikon aksi pakai token (`text-destructive hover:bg-destructive/10`)
- `src/app/(app)/dashboard/page.tsx`, `reports/advanced/page.tsx` — struktur Card & heading rapi
- `globals.css` — design token lengkap light + dark (fondasi sudah benar, tinggal dipakai konsisten)

---

## 📊 Ringkasan

| Kategori                      | Jumlah file terdampak |
| ----------------------------- | --------------------- |
| Warna hardcoded (high)        | 11 file               |
| Judul/padding/tombol (medium) | ±18 titik             |
| Dev tooling (low)             | 5 file                |
| File backup sampah            | 7 file                |

---

## 🚀 Progress Eksekusi

### Batch 1 — Prioritas Tinggi (SELESAI, terverifikasi `npm run build` ✓)

Seluruh 11 file prioritas tinggi telah dikonversi ke design token:

| File | Konversi utama |
|---|---|
| teams/page | `gray-*`→`muted-foreground`, `yellow` badge→`warning/10`, h1→gaya detail, container `p-4` |
| promos/page | tombol `bg-black`→`buttonVariants()`, h1→gaya list utama, `gray-*`→token |
| OrderActionButtons | `green-600`→`bg-success hover:bg-success/90 text-success-foreground` |
| ReceiptWaButton | idem |
| new/tx/page | `emerald-600`→`success` (kini seragam dengan orders) |
| customers/[id] | STATUS_CONFIG→pola `token/10 + token + border token/20`, kartu catatan kuning→`warning/5` |
| customers/page | avatar gender→`info/10` & `chart-5/10` (dark-aware), WA hijau→`text-success` |
| orders/[id]/page | Badge Lunas→`success/10 pattern`, diskon→`text-success` |
| MarkPaidInline | seluruh orange→`warning` tokens |
| reports FilterForm | orange border/ring/icon→`border-warning/40 focus-visible:ring-ring text-warning` |
| transactions FilterForm | `text-emerald-600`→`text-success` |

**Catatan validasi:** `npm run lint` gagal karena issue pre-existing (typescript-eslint belum support TS 7 di eslint-config-next) — bukan akibat perubahan ini. Scan residu: hanya `PrintLab.tsx` yang tersisa (whitelist tool internal).
