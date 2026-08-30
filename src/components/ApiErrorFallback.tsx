// coteadmin/src/components/ApiErrorFallback.tsx
import { AlertTriangle, ShieldOff, SearchX, WifiOff, Clock } from 'lucide-react';
import { ApiError } from '@/lib/cotebek';

type FallbackConfig = {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  code: string;
};

function resolveFallback(error: unknown): FallbackConfig {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 0:
        return {
          icon: WifiOff,
          title: 'Gak Bisa Terhubung',
          description: 'Gagal menghubungi server. Cek koneksi kamu atau coba lagi sebentar.',
          code: 'NETWORK',
        };
      case 403:
        return {
          icon: ShieldOff,
          title: 'Gak Punya Akses',
          description: 'Kamu gak punya izin buat lihat halaman ini. Hubungi admin/owner kalau ini seharusnya bisa diakses.',
          code: 'FORBIDDEN_403',
        };
      case 404:
        return {
          icon: SearchX,
          title: 'Data Gak Ditemukan',
          description: 'Data yang kamu cari gak ada atau udah dihapus.',
          code: 'NOT_FOUND_404',
        };
      case 429:
        return {
          icon: Clock,
          title: 'Kebanyakan Request',
          description: 'Terlalu banyak request dalam waktu singkat. Tunggu sebentar terus coba lagi.',
          code: 'RATE_LIMIT_429',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Ada yang Gak Beres',
          description: 'Server lagi bermasalah. Coba lagi beberapa saat lagi.',
          code: `SERVER_${error.status}`,
        };
    }
  }

  return {
    icon: AlertTriangle,
    title: 'Ada yang Gak Beres',
    description: 'Terjadi kesalahan yang gak terduga.',
    code: 'UNKNOWN',
  };
}

export function ApiErrorFallback({ error }: { error: unknown }) {
  const { icon: Icon, title, description, code } = resolveFallback(error);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="text-muted-foreground" size={28} />
      </div>
      <h2 className="text-foreground font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">{description}</p>
      <p className="text-[10px] text-muted-foreground/50 mt-4 font-mono uppercase tracking-wider">
        Kode: {code}
      </p>
    </div>
  );
}