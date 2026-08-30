// coteadmin/src/lib/branding.ts
import { cotebek, cotebekPublic } from "@/lib/cotebek";
import {
  Home,
  ClipboardList,
  Users,
  Wallet,
  Menu,
  PieChart,
  type LucideIcon,
} from "lucide-react";

export type BusinessType = "JASA" | "FNB" | "RETAIL" | "PERSONAL" | "OTHER";

export type Branding = {
  businessName: string;
  businessType: BusinessType;
  primaryColor: string;
  websiteUrl?: string;
  phone?: string;
};

export const DEFAULT_BRANDING: Branding = {
  businessName: "CoTE System",
  businessType: "JASA",
  primaryColor: "#f0a500",
};

export async function getBranding(): Promise<Branding> {
  try {
    /* const res = await cotebekPublic<{ data: Partial<Branding> }>(
      "/app-settings/public/branding",
      300, // refresh tiap 60 detik
    ); */

    const res = await cotebekPublic<{ data: Partial<Branding> }>(
      "/app-settings/public/branding",
    );

    const clean = Object.fromEntries(
      Object.entries(res.data).filter(([, v]) => v !== null && v !== undefined),
    );
    return { ...DEFAULT_BRANDING, ...clean };
  } catch {
    return DEFAULT_BRANDING;
  }
}

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavPreset = {
  left: NavItem[];
  right: NavItem[];
  fab: { href: string; label: string };
};

export const NAV_PRESETS: Record<BusinessType, NavPreset> = {
  JASA: {
    left: [
      { href: "/dashboard", label: "Overview", icon: Home },
      { href: "/orders", label: "Order", icon: ClipboardList },
    ],
    right: [
      { href: "/customers", label: "Cust", icon: Users },
      { href: "/more", label: "More", icon: Menu },
    ],
    fab: { href: "/new", label: "Input" },
  },
  FNB: {
    left: [
      { href: "/dashboard", label: "Overview", icon: Home },
      { href: "/orders", label: "Order", icon: ClipboardList },
    ],
    right: [
      { href: "/transactions", label: "Kas", icon: Wallet },
      { href: "/more", label: "More", icon: Menu },
    ],
    fab: { href: "/new", label: "Input" },
  },
  RETAIL: {
    left: [
      { href: "/dashboard", label: "Overview", icon: Home },
      { href: "/orders", label: "Order", icon: ClipboardList },
    ],
    right: [
      { href: "/transactions", label: "Kas", icon: Wallet },
      { href: "/more", label: "More", icon: Menu },
    ],
    fab: { href: "/new", label: "Input" },
  },
  PERSONAL: {
    left: [
      { href: "/dashboard", label: "Overview", icon: Home },
      { href: "/transactions", label: "Kas", icon: Wallet },
    ],
    right: [
      { href: "/reports", label: "Report", icon: PieChart },
      { href: "/more", label: "More", icon: Menu },
    ],
    fab: { href: "/new", label: "Input" },
  },
  OTHER: {
    left: [
      { href: "/dashboard", label: "Overview", icon: Home },
      { href: "/transactions", label: "Kas", icon: Wallet },
    ],
    right: [
      { href: "/orders", label: "Order", icon: ClipboardList },
      { href: "/more", label: "More", icon: Menu },
    ],
    fab: { href: "/new", label: "Input" },
  },
};
