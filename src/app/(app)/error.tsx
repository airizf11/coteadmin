// coteadmin/src/app/(app)/error.tsx
'use client';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // const isRateLimit = error.message.toLowerCase().includes('too many') || error.message.includes('429');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-muted-foreground mb-1">
        {/* {isRateLimit ? 'Kebanyakan request dalam waktu singkat.' : 'Ada yang gak beres.'} */}
        Maaf, Ada yang error atau gak beres.
      </p>
      <p className="text-xs text-muted-foreground/70 mb-6">
        {/* {isRateLimit ? 'Tunggu sebentar, terus coba lagi.' : error.message} */}
        Coba lagi dalam beberapa saat. Kalau masih gagal, hubungi admin.
      </p>
      <button onClick={() => reset()} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium cursor-pointer">
        Coba Lagi
      </button>
    </div>
  );
}