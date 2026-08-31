// coteadmin/src/lib/icons.ts
import fs from "node:fs";
import path from "node:path";

export function slugifyBusinessName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveIconPath(businessName: string, size: 192 | 512): string {
  const slug = slugifyBusinessName(businessName);
  const filename = `${slug}-${size}.png`;
  const fullPath = path.join(process.cwd(), "public", "icons", filename);

  try {
    if (fs.existsSync(fullPath)) {
      return `/icons/${filename}`;
    }
  } catch {
    // permission/mount error dsb — gak boleh sampe nge-crash seluruh app
    // cuma gara-gara icon 1 tenant bermasalah.
  }
  return `/icon-${size}.png`; // fallback default CoTE
}
