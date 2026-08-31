// coteadmin/src/app/layout.tsx
import { Providers } from './providers';
import './globals.css';
import { Metadata } from 'next';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner';
import { getBranding } from '@/lib/branding';
import { resolveIconPath } from '@/lib/icons';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export async function generateMetadata(): Promise<Metadata> {
  const b = await getBranding();
  return {
    title: `${b.businessName} System`,
    icons: {
      icon: resolveIconPath(b.businessName, 192),
      apple: resolveIconPath(b.businessName, 512),
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: b.businessName,
    },
  };
}

// export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const b = await getBranding();
  return (
    <html lang="id" className={cn("font-sans", inter.variable)}
    suppressHydrationWarning
    >

      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) document.documentElement.classList.add('dark');
                  if (localStorage.getItem('privacyMode') === '1') {
                  document.documentElement.classList.add('privacy-mode');
                }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body style={{ '--primary': b.primaryColor } as React.CSSProperties}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}