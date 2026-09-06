// coteadmin/src/lib/theme.ts
import { cotebekPublic } from "@/lib/cotebek";

export type ThemeManifest = {
  businessName: string;
  businessType: string;
  footerLine: string;
  colors: {
    primary: string;
    primarySoft: string;
    primaryDark: string;
    primaryDarkSoft: string;
    onPrimary: string;
  };
  ui: {
    light: Record<string, string>;
    dark: Record<string, string>;
  } | null;
};

export async function getThemeManifest(): Promise<ThemeManifest | null> {
  try {
    const res = await cotebekPublic<{ data: ThemeManifest }>(
      "/app-settings/public/branding-theme",
    );
    return res.data;
  } catch {
    return null;
  }
}

export function buildBrandCss(manifest: ThemeManifest | null): string {
  if (!manifest?.ui) return "";

  const toRules = (tokens: Record<string, string>) =>
    Object.entries(tokens)
      .map(([key, value]) => `${key}:${value}`)
      .join(";");

  return `:root:root{${toRules(manifest.ui.light)}}:root.dark{${toRules(manifest.ui.dark)}}`;
}
