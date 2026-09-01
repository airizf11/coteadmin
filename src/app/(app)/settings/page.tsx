// coteadmin/src/app/(app)/settings/page.tsx
import { cotebek } from '@/lib/cotebek';
import { SettingsForm } from './SettingsForm';
import Link from 'next/link';
import { ArrowLeft, Store } from 'lucide-react';

type Settings = { 
  order_prefix?: string; 
  tx_prefix?: string;
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  receipt_footer?: string; 
  business_type?: string;
  primary_color?: string;
  website_url?: string;
  dashboard_window_days?: string;
  order_flow?: string[];
};

export default async function SettingsPage() {
  const res = await cotebek<{ data: Settings }>('/app-settings');
  
  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* HEADER W/ BACK BUTTON */}
      <div className="flex items-center gap-3">
        <Link 
          href="/more" 
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Kembali ke Menu Lainnya"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight flex items-center gap-2">
            <Store size={22} className="text-primary" aria-hidden="true" />
            Pengaturan Toko
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Konfigurasi identitas & sistem usaha.</p>
        </div>
      </div>

      {/* FORM COMPONENT */}
      <SettingsForm settings={res.data} />
      
    </div>
  );
}