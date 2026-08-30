# Checklist Verifikasi UI — coteadmin

> Jalankan checklist ini **sebelum** menyatakan task UI selesai.
> Centang sesuai scope: kalau hanya mengubah 2 halaman, verifikasi 2 halaman itu (plus halaman yang terdampak).

## Cara menjalankan

```bash
npm run dev
```

Buka di browser: desktop + mobile viewport (DevTools → responsive, mis. iPhone SE 375px).

---

## ✅ Verifikasi per halaman yang diubah

- [ ] **Light mode** — tampilan benar, tidak ada teks/elemen hilang kontras
- [ ] **Dark mode** — tampilan benar, tidak ada elemen "belang" (terang di tema gelap / sebaliknya)
- [ ] **Mobile viewport (375px)** — tidak overflow horizontal, tombol mudah dijangkau
- [ ] **Desktop** — layout masuk akal, tidak ada elemen melebar aneh
- [ ] Konten tidak tertutup bottom-nav (scroll sampai bawah)
- [ ] Judul h1 sesuai konvensi (`docs/conventions/ui-conventions.md` §2)
- [ ] Semua warna memakai token (tidak ada `gray-*`, `green-600`, dll baru)

## 🔘 Interaksi

- [ ] Semua tombol/link aksi berfungsi (navigate/submit)
- [ ] State loading tampil (disabled + spinner), tidak bisa double-submit
- [ ] State kosong (empty state) punya pesan yang jelas
- [ ] Toast/notifikasi muncul untuk aksi sukses/gagal (sonner)

## 🖨️ Khusus halaman print receipt (`orders/[id]/receipt`)

- [ ] Preview receipt rapi di layar
- [ ] Print preview (Ctrl+P) bersih: tanpa header/nav/tombol (`print:hidden` bekerja)
- [ ] Lebar print pas untuk thermal printer (~200px)

## 📱 Khusus halaman publik (`track/[trackingToken]`)

- [ ] Bisa dibuka tanpa login
- [ ] Tampilan benar di mobile (kemungkinan besar diakses dari HP pelanggan)

## 🏁 Sebelum commit

- [ ] `npm run lint` — tidak ada error baru
- [ ] `npm run build` — sukses
- [ ] Item audit terkait sudah dicentang `- [x]` di `docs/audits/UI_AUDIT.md`
- [ ] Tidak membuat file backup baru (`*.b00`, `*.b001`, `*.1`)
