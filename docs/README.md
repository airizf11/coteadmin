# 📚 Dokumentasi coteadmin

> **Untuk AI agent & developer:** baca dokumen ini SEBELUM menulis kode.
> Urutan baca: `conventions/` → `prd/` (jika relevan) → `audits/` (jika mengerjakan perbaikan) → `verify/` (sebelum menyatakan selesai).

## 🌍 Ekosistem CoTE (3 repo sibling)

| Repo | Path | Peran | Catatan env |
|---|---|---|---|
| **cotebek** | `devs/bek/cotebek` | Backend NestJS API multiservis | Jalan di **port 3099** (bukan 3000!) |
| **coteadmin** | `devs/web/coteadmin` | Dasbor internal tiap usaha (repo ini) | Node via `conda activate work1` |
| **coteweb** | `devs/web/coteweb` | Landing page publik + **onboarding** (submit pengajuan usaha) + **panel internal superadmin** (approve/reject submissions, create app untuk klien) | Stack sama: Next 16 + React 19 |

Ketiganya berkomunikasi lewat kontrak di `reference/api-contract.md`. Helper `lib/cotebek.ts` identik di coteadmin & coteweb.


## 🗂️ Struktur

```
docs/
├── README.md                        # ← kamu di sini
├── prd/                             # PRD: kenapa & apa (requirements)
│   └── ui-consistency-prd.md        #    PRD perbaikan konsistensi UI
├── conventions/                     # Aturan main yang WAJIB diikuti
│   └── ui-conventions.md            #    Design token, heading, spacing, button
├── audits/                          # Checklist eksekusi / temuan masalah
│   ├── UI_AUDIT.md                  #    Audit inkonsistensi UI (working checklist)
│   └── API_GAP.md                   #    Fitur backend yang belum dipakai frontend
├── reference/                       # Referensi teknis lintas-repo
│   └── api-contract.md              #    Kontrak API cotebek (endpoint, auth, envelope)
└── verify/                          # Checklist verifikasi sebelum selesai
    └── ui-verify.md                 #    QA manual: dark mode, mobile, print, dll
```

## 🔄 Alur kerja yang disarankan

```
PRD (apa & kenapa)
   ↓
Conventions (aturan main)
   ↓
Audit (daftar masalah + ceklis)  ← kerjakan item satu per satu, centang saat beres
   ↓
Verify (pemeriksaan akhir)       ← jangan skip!
```

## 📌 Aturan penting untuk agent

1. **Jangan hardcode warna Tailwind palet** (`gray-500`, `green-600`, dst) — pakai design token dari `globals.css`. Lihat `conventions/ui-conventions.md`.
2. **Saat memperbaiki item audit**, centang `- [x]` di file audit terkait setelah selesai + terverifikasi.
3. **Sebelum menyatakan task selesai**, jalankan checklist di `verify/ui-verify.md` sesuai scope pekerjaan.
4. File backup (`*.b00`, `*.b001`, `*.1`) adalah sampah — jangan dibaca sebagai referensi, dan jangan buat baru.

## 🔮 Rencana dokumen berikutnya (belum ada)

| Dokumen                           | Status                                                       |
| --------------------------------- | ------------------------------------------------------------ |
| `conventions/code-conventions.md` | belum dibuat                                                 |
| `reference/api-contract.md`       | ✅ dibuat (sinkron source 2026-08-26)                        |
| `reference/auth-session-flow.md`  | belum dibuat                                                 |
| `reference/printer-bluetooth.md`  | belum dibuat                                                 |
| `reference/wa-templates.md`       | belum dibuat                                                 |
| `ops/env-deployment.md`           | belum dibuat                                                 |
