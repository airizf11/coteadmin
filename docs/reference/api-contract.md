# CoTEBek API Contract — referensi untuk coteadmin

> Sumber kebenaran: source code `cotebek` (NestJS) di sibling repo `devs/bek/cotebek`.
> Dipakai coteadmin agar tidak salah tebak endpoint/shape response.
> Terakhir disinkronkan: 2026-08-26 (dibaca dari source code).

## 1. Dasar

| Hal | Nilai |
|---|---|
| Base URL (frontend) | `process.env.COTEBEK_API_URL` — **sudah termasuk** prefix+version |
| Prefix global backend | `/cteapi` |
| Versioning | URI, default `v1` → path lengkap di server: `/cteapi/v1/<resource>` |
| Swagger | `/cteapi/docs` (Basic Auth jika env di-set), JSON: `/cteapi/docs-json` |
| CORS | whitelist `ALLOWED_ORIGINS`; header izin: `Content-Type`, `Authorization`, `x-api-key` |
| Validation | Global `ValidationPipe`: `whitelist` + `forbidNonWhitelisted`, auto-transform type |
| Rate limit | Auth di-throttle (login/google 10/menit, refresh 20/menit, join 5/menit); resource endpoints `SkipThrottle` |

> ⚠️ Karena `forbidNonWhitelisted`: jangan pernah mengirim field ekstra di body → error 400.

## 2. Autentikasi (dual-auth)

Request dari coteadmin melewati `DualAuthGuard` = dua kredensial sekaligus:

1. **`x-api-key: <COTEBEK_API_KEY>`** — identitas **app/usaha** (`req.appInfo.id`). Wajib selalu.
2. **`Authorization: Bearer <JWT>`** — identitas **user** (`req.user.id`), dari session via `getStaffToken()`.

- Helper frontend: `src/lib/cotebek.ts` — memasang kedua header + forward `x-forwarded-for`.
- Default `requireAuth: true`; `requireAuth: false` hanya untuk endpoint publik.
- Refresh flow: `POST /auth/refresh` (dipakai `lib/auth-refresh.ts`).

Endpoint auth:

| Method | Path | Catatan |
|---|---|---|
| POST | `/auth/login` | email+password |
| POST | `/auth/google` | Google ID token |
| POST | `/auth/refresh` | pair token baru |
| POST | `/auth/logout` | invalidasi refresh token |
| GET | `/auth/membership` | → `{ isMember, role }`; gate `(app)/layout.tsx` |

## 3. Bentuk response (envelope)

```ts
{
  success: true,
  statusCode: number,
  message: string,
  data?: T,      // payload utama
  meta?: object  // paginasi/summary
}
```

Error via `HttpExceptionFilter`: `success:false`, `statusCode`, `message`. Frontend membaca `res.data`, menangkap error lewat `errBody.message`.

## 4. Role & akses

Role app: `DEV > OWNER > ADMIN > STAFF`. Prinsip umum:

- **STAFF**: baca data operasional + create order/customer/transaction, update status order, tandai lunas, upload attachment
- **ADMIN**: + kelola items/promos/raw-materials/team-members/settings
- **OWNER**: + approve/remove member, invite, audit logs
- **DEV**: setara OWNER (internal)

## 5. Daftar endpoint per modul

Kolom "Dipakai" = contoh pemakaian di coteadmin.

### Apps (`/apps`)
| Method | Path | Role | Dipakai |
|---|---|---|---|
| POST | `/apps` atau `/apps/self-serve` | JWT → jadi Owner | devtest/onboarding |
| POST | `/apps/join` | JWT (body: apiKey) | onboarding staf |
| GET | `/apps/me` | dual | teams/page — app saat ini |
| GET | `/apps/:appId/members` | OWNER/ADMIN/STAFF* | teams |
| PUT | `/apps/:appId/members/:userId/approve` | OWNER | teams |
| DELETE | `/apps/:appId/members/:userId` | OWNER | RemoveButton |
| POST | `/apps/:appId/invite` | OWNER | InviteForm |
| GET | `/apps/:appId/invites` | OWNER | teams |

### Orders (`/orders`)
| Method | Path | Role | Dipakai |
|---|---|---|---|
| POST | `/orders` | semua | new/orders/actions |
| GET | `/orders?status&paymentStatus&page&limit` | semua | orders/page |
| GET | `/orders/active` | semua | dashboard |
| GET | `/orders/track/:orderNumber` | **PUBLIC** | orders/[id] riwayat status |
| GET | `/orders/track-token/:trackingToken` | **PUBLIC** | track/[trackingToken] |
| GET | `/orders/:id/receipt` | semua | receipt/page |
| GET | `/orders/:id` | semua | orders/[id]/page |
| PATCH | `/orders/:id/status` `{ status }` | semua | OrderActionButtons |
| PATCH | `/orders/:id/pay` `{ paymentMethod? }` | semua | OrderActionButtons |

State machine status: `RECEIVED→IN_PROCESS→READY→DONE`; `CANCELLED` hanya dari 3 tahap pertama.

### Customers (`/customers`)
POST `/`, GET `/`, GET `/search/phone?phone=`, GET `/:id`, PUT `/:id`, DELETE `/:id` — semua role. Dipakai customers/*, CustomerPicker.

### Items (`/items`)
POST `/` & PUT `/:id` & DELETE `/:id` (soft-delete) = OWNER/ADMIN; GET `/` (`includeInactive=true`) & GET `/:id` = semua.

### Transactions (`/transactions`)
| Method | Path | Role |
|---|---|---|
| POST | `/transactions` | semua |
| GET | `/transactions?startDate&endDate&type&page&limit` | **OWNER/ADMIN saja** |
| PATCH | `/transactions/:id/pay` | semua (MarkPaidInline) |
| GET | `/transactions/:id` | semua |

⚠️ List transaksi tidak untuk STAFF — guard menu di frontend sesuaikan.

### Promos (`/promos`)
POST `/` (OWNER/ADMIN), GET `/`, GET `/:id` (semua), PUT `/:id` (OWNER/ADMIN; dipakai toggle isActive), DELETE `/:id` (= deactivate), POST `/check?orderAmount=&customerId=` (preview diskon).

### Reports (`/reports`)
- Semua role: `/summary`, `/top-items`, `/sales-trend`, `/payment-methods`, `/overview`, `/status-breakdown`, `/staff-dashboard`
- OWNER/ADMIN: `/promo-budget`, `/expense-summary`, `/expense-by-category`, `/net-profit`, `/staff-activity`, `/top-customers`, `/customer-demographics`, `/export`
- Query umum: `startDate`, `endDate`; export juga `compareStartDate`, `compareEndDate`, `format=xlsx|pdf`

### Attachments (`/attachments`)
POST `/?note=` (**multipart**, field `file`; max 15 MB; jpeg/png/webp/pdf), GET `/`, GET `/:id/download`, GET `/:id/view`, DELETE `/:id` (OWNER/ADMIN).

### Lainnya
- **team-members**: POST `/` (OWNER/ADMIN), GET `/` (semua)
- **app-settings**: GET `/`, GET `/public/branding` (**public**, api-key only — dipakai `lib/branding.ts`), GET `/:key`, POST `/` & `/bulk` (OWNER), DELETE `/:key` (OWNER)
- **audit-logs**: GET `/` — OWNER/DEV saja
- **raw-materials**: POST `/`, GET `/`
- **users**: GET `/users/me/apps` (devtest)

## 6. Catatan integrasi penting

1. **Binary endpoints** (`reports/export`, `attachments/upload|download|view`) TIDAK kompatibel dengan helper `cotebek()` yang selalu `res.json()`. Butuh wrapper fetch terpisah (FormData / blob).
2. **Public endpoints** (api-key tanpa JWT): `orders/track*`, `app-settings/public/branding` → panggil dengan `requireAuth: false`.
3. **Paginasi**: `page` + `limit`; info hasil ada di `meta`.
4. Jika DTO/controller cotebek berubah → **perbarui dokumen ini** agar agent tidak salah asumsi.

