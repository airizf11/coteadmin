# PRD: Konsistensi UI coteadmin

|            |                                         |
| ---------- | --------------------------------------- |
| **Status** | Draft — menunggu eksekusi               |
| **Sumber** | Hasil audit `docs/audits/UI_AUDIT.md`   |
| **Scope**  | Semua halaman user-facing di `src/app/` |

---

## 1. Latar Belakang

coteadmin sudah punya fondasi design system yang baik: token lengkap (light + dark mode) di `src/app/globals.css`, komponen shadcn/ui di `src/components/ui/`, dan beberapa halaman yang sudah konsisten (dashboard, orders filter bar).

Namun, audit menemukan banyak halaman yang masih memakai warna Tailwind palet mentah (`gray-500`, `green-600`, `emerald-600`, `yellow-100`, dll) alih-alih design token. Akibatnya:

1. **Tampilan "belang"** — sebagian halaman ikut tema, sebagian tidak, terutama terlihat di dark mode.
2. **Dua warna hijau berbeda** dipakai untuk makna yang sama (success): `bg-green-600` dan `bg-emerald-600`.
3. **Judul halaman punya 3+ gaya berbeda** sehingga hierarki visual tidak konsisten antar halaman.
4. **Padding container bervariasi** (`pb-24`, `pb-8`, tanpa-pb) padahal layout sudah menyediakan clearance bottom-nav.

## 2. Tujuan

1. 100% halaman user-facing memakai design token (bukan palet mentah) untuk warna bermakna (success, destructive, warning, info, muted).
2. Hierarki judul halaman seragam sesuai konvensi di `docs/conventions/ui-conventions.md`.
3. Padding container seragam dengan satu strategi yang jelas.
4. Semua tombol/link aksi memakai komponen `<Button>` / `buttonVariants()`.
5. Aplikasi lolos pemeriksaan dark mode & light mode tanpa elemen belang.

## 3. Non-Goals (di luar scope)

- Redesign visual / ganti tema warna brand.
- Refactor logika bisnis atau struktur data.
- Perbaikan tampilan tool internal (`devtest/*`, `PrintLab.tsx`) — opsional, prioritas rendah.

## 4. Requirements

### R1 — Konversi warna ke token

Semua class warna hardcoded pada halaman `(app)`, `login`, `track` dikonversi sesuai tabel mapping di `docs/conventions/ui-conventions.md`. Detail per file ada di `docs/audits/UI_AUDIT.md` bagian Prioritas Tinggi.

### R2 — Standarisasi judul

Setiap h1 mengikuti salah satu dari dua gaya resmi (list utama / detail-form). Tidak ada gaya ad-hoc.

### R3 — Standarisasi padding container

Satu strategi untuk clearance bottom-nav (layout sudah kasih `pb-20`). Putusan final dicatat di conventions; semua halaman mengikuti.

### R4 — Komponen tombol

Tidak ada raw `<button>`/`<Link>` bergaya tombol dengan class warna manual. Ikon-only action diperbolehkan asal pakai token.

### R5 — Kebersihan repo

File backup `.b00`/`.b001`/`.1` dihapus, pola ditambahkan ke `.gitignore`.

## 5. Definisi Selesai (Definition of Done)

- [ ] Semua item di `docs/audits/UI_AUDIT.md` (prioritas tinggi & sedang) tercentang.
- [ ] Checklist `docs/verify/ui-verify.md` lolos untuk semua halaman yang diubah.
- [ ] `npm run build` sukses tanpa error.
- [ ] Scan ulang regex hardcoded color di `src/app/(app)` menghasilkan 0 temuan (kecuali yang di-whitelist).

## 6. Risiko & Catatan

- Perubahan warna bisa memengaruhi keterbacaan di print receipt (`orders/[id]/receipt`) — verifikasi khusus print tersedia di checklist verify.
- Beberapa warna gender avatar (biru/pink) mungkin memang disengaja sebagai diferensiasi — putusan: pertahankan makna, tapi konversi ke pola yang dark-mode aware.
