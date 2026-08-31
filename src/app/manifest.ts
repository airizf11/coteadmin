// coteadmin/src/app/manifest.ts
import { getBranding } from "@/lib/branding";
import { resolveIconPath } from "@/lib/icons";
import type { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const b = await getBranding();
  return {
    name: `${b.businessName} System`,
    short_name: b.businessName,
    description: `Manajemen usaha untuk ${b.businessName}`,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#eeeeee",
    theme_color: b.primaryColor,
    icons: [
      {
        src: resolveIconPath(b.businessName, 192),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: resolveIconPath(b.businessName, 512),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
