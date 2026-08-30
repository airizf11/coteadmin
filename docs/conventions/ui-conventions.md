# Konvensi UI — coteadmin

> **WAJIB diikuti** oleh semua developer & AI agent saat menulis/mengubah UI.
> Pelanggaran konvensi ini = bug, meskipun tampilannya "jalan".

---

## 1. Warna: selalu design token, bukan palet mentah

Token didefinisikan di `src/app/globals.css` (light + dark). Jangan pernah hardcode warna palet Tailwind (`gray-500`, `green-600`, dst) untuk warna yang punya makna.

### Tabel mapping

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

### Pola badge status (satu untuk semua)

```
bg-{token}/10 text-{token} border-{token}/20
```

Contoh: `bg-success/10 text-success border-success/20`, `bg-destructive/10 text-destructive border-destructive/20`

### Token yang tersedia

`primary`, `secondary`, `muted`, `accent`, `destructive`, `success`, `warning`, `info`, `card`, `popover`, `border`, `input`, `ring`, `chart-1..5`, `sidebar-*`.
Masing-masing punya `-foreground`; beberapa punya `-subtle`. Cek `globals.css` sebelum menambah token baru.

### Whitelist (pengecualian yang boleh)

- Warna di chart/grafik via token `chart-*`.
- Blok kode/log terminal: pola gelap tetap gelap di kedua mode (dokumentasikan jika dipakai).
- Tool internal `devtest/*` dan `PrintLab.tsx` (prioritas rendah, tidak diblokir).

---

## 2. Hierarki judul halaman (h1)

| Tipe halaman                         | Class h1                                                        |
| ------------------------------------ | --------------------------------------------------------------- |
| List utama (Orders, Items, dst)      | `text-2xl font-heading font-bold text-primary tracking-tight`   |
| Detail / Form (Order [id], Tambah X) | `text-xl font-heading font-bold text-foreground tracking-tight` |
| Subtitle (opsional)                  | `text-sm text-muted-foreground mt-1`                            |

Aturan:

- Satu halaman = satu h1.
- Judul detail/form **wajib** eksplisit `text-foreground` (jangan mengandalkan inherit).
- Ikon di samping judul: `size={22–24}` + `aria-hidden="true"`.

---

## 3. Padding container halaman

Layout `(app)/layout.tsx` sudah memberi `pb-20` pada wrapper untuk clearance bottom-nav.

➡️ **Standar container halaman: `p-4` saja.**

- Hapus variasi `pb-24` / `pb-8` kecuali konten memang butuh ruang scroll ekstra (mis. daftar panjang dengan FAB).
- Jika butuh ekstra, gunakan `pb-24` secara konsisten dan catat alasannya di file ini.

---

## 4. Tombol & aksi

1. Selalu pakai komponen `<Button>` dari `@/components/ui/button` atau `buttonVariants()` untuk link bergaya tombol.
2. Dilarang raw `<button>` / `<Link>` dengan class warna manual (`bg-black`, `bg-green-600`, dll).
3. Ikon-only action boleh raw `<button>`, tapi wajib pakai token:
   - Contoh benar: `text-destructive hover:bg-destructive/10`
   - Contoh benar: `text-muted-foreground hover:bg-muted`
4. Ukuran tombol aksi utama mobile: `h-11`.
5. Tombol pending/loading: wajib state disabled + spinner (`Loader2` + `animate-spin`).

---

## 5. Card

- Card standar: `<Card className="shadow-sm">`.
- Card interaktif/hover: tambahkan `transition-all hover:shadow-md` (+ `hover:border-primary/40` bila clickable).
- Konten card: `CardContent className="p-4"` (tambah `space-y-*` sesuai kebutuhan).

---

## 6. Dark mode

- Dark mode aktif via `prefers-color-scheme` (lihat `globals.css`). Tidak ada toggle manual saat ini.
- Karena itu: **setiap class warna harus terlihat benar di kedua mode**. Cara termudah: pakai token — sudah otomatis.
- Jika terpaksa pakai warna spesifik, wajib sertakan varian `dark:`.

---

## 7. Ikon

- Sumber: `lucide-react`.
- Ukuran standar: nav `20`, judul `22–24`, inline/badge `14–16`.
- Ikon dekoratif wajib `aria-hidden="true"`.
