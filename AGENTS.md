<!-- BEGIN:project-docs -->

# Project documentation (WAJIB dibaca)

Sebelum menulis/mengubah kode, baca `docs/README.md` lalu ikuti:

- `docs/conventions/ui-conventions.md` — aturan UI (token warna, heading, spacing, button). Pelanggaran = bug.
- `docs/audits/` — checklist perbaikan; centang item saat selesai + terverifikasi.
- `docs/verify/` — jalankan checklist verifikasi sebelum menyatakan task selesai.

Dilarang hardcode warna palet Tailwind (`gray-500`, `green-600`, dst) — pakai design token dari `src/app/globals.css`.

<!-- END:project-docs -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
