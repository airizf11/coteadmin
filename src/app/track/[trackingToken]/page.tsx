// coteadmin/src/app/track/[trackingToken]/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Check,
  SearchX,
  ArrowLeft,
  AlertCircle,
  CalendarClock,
  Ban,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { STATUS_CONFIG } from '@/lib/constants/order-status';

type TrackingData = {
  orderNumber: string;
  status: string;
  paymentStatus: 'PAID' | 'UNPAID';
  dueDate: string | null;
  createdAt: string;
  customerName: string | null;
  items: { itemName: string; qty: number }[];
  statusHistory: { status: string | null; timestamp: string }[];
};

const ALL_STEPS = ['RECEIVED', 'IN_PROCESS', 'READY', 'DONE'];

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ trackingToken: string }>;
}) {
  const { trackingToken } = await params;

  let data: TrackingData | null = null;

  try {
    const res = await cotebek<{ data: TrackingData }>(
      `/orders/track-token/${trackingToken}`,
      { requireAuth: false }
    );

    data = res.data;
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-info/5 blur-3xl"
        />

        <Card className="relative w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 border-border/80 bg-card/95 text-center shadow-xl backdrop-blur">
          <CardContent className="px-6 pb-7 pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <SearchX size={30} />
            </div>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground">
              Order Tidak Ditemukan
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Coba periksa kembali nomor order pada struk kamu.
            </p>

            <Link
              href="/track"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'mt-6 h-11 w-full rounded-xl'
              )}
            >
              <ArrowLeft size={16} className="mr-2" />
              Lacak Nomor Lain
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCancelled = data.status === 'CANCELLED';
  const currentStepIndex = ALL_STEPS.indexOf(data.status);

  const historyByStatus = new Map(
    data.statusHistory
      .filter((h) => h.status)
      .map((h) => [h.status, h.timestamp])
  );

  const currentStatusLabel =
    STATUS_CONFIG[data.status]?.label ?? data.status;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-5 sm:py-8">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-info/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-success/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-md space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/track"
            aria-label="Kembali ke pencarian"
            className="group flex items-center gap-2 rounded-xl py-2 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-transform duration-200 group-hover:-translate-x-0.5">
              <ArrowLeft size={17} />
            </span>

            <span className="hidden sm:inline">
              Kembali
            </span>
          </Link>

          {!isCancelled && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
                <span className="relative h-2 w-2 rounded-full bg-success" />
              </span>
              Status aktif
            </div>
          )}
        </div>

        {/* Order identity */}
        <section className="animate-in fade-in slide-in-from-bottom-2 text-center duration-500">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Nomor Order
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {data.orderNumber}
          </h1>

          {data.customerName && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.customerName}
            </p>
          )}
        </section>

        {/* Main status */}
        {isCancelled ? (
          <section className="relative overflow-hidden rounded-3xl border border-destructive/20 bg-destructive-subtle p-6 text-center shadow-sm animate-in fade-in zoom-in-[0.98] duration-500">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-destructive/10 blur-3xl"
            />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive text-destructive-foreground shadow-sm">
                <Ban size={29} />
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive/70">
                Status
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Pesanan Dibatalkan
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Pesanan ini telah dibatalkan dan tidak lagi diproses.
              </p>
            </div>
          </section>
        ) : (
          <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-subtle via-card to-card p-6 text-center shadow-sm animate-in fade-in zoom-in-[0.98] duration-500 sm:p-7">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                {data.status === 'DONE' ? (
                  <Check size={30} strokeWidth={2.5} />
                ) : data.status === 'READY' ? (
                  <CheckCircle2 size={30} strokeWidth={2.3} />
                ) : (
                  <>
                    <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
                    <Clock size={29} />
                  </>
                )}
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Status saat ini
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {currentStatusLabel}
              </h2>

              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Sedang berjalan
              </div>
            </div>
          </section>
        )}

        {/* Payment */}
        {!isCancelled && data.paymentStatus === 'UNPAID' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-warning/25 bg-warning-subtle p-4 duration-500">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
                <AlertCircle size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-warning">
                  Belum Lunas
                </p>

                <p className="mt-1 text-xs leading-relaxed text-warning/80">
                  Mohon siapkan pembayaran saat pengambilan pesanan nanti ya.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {!isCancelled && (
          <Card className="animate-in fade-in slide-in-from-bottom-3 border-border/80 bg-card/90 shadow-sm backdrop-blur duration-700">
            <CardHeader className="border-b border-border/60 px-5 pb-4 pt-5">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Clock size={16} className="text-primary" />
                Riwayat Perjalanan
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-6">
              <div
                className="relative"
                aria-label="Status perjalanan"
              >
                {/* Base line */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-5 left-[18px] top-5 w-px bg-border"
                />

                {/* Progress line */}
                {currentStepIndex > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-[18px] top-5 w-px bg-success transition-all duration-700"
                    style={{
                      height: `${Math.min(
                        currentStepIndex / (ALL_STEPS.length - 1),
                        1
                      ) * 100}%`,
                    }}
                  />
                )}

                <div className="space-y-7">
                  {ALL_STEPS.map((step, i) => {
                    const isPast = i < currentStepIndex;
                    const isActive = i === currentStepIndex;
                    const isFuture = i > currentStepIndex;

                    const timestamp =
                      step === 'RECEIVED'
                        ? data.createdAt
                        : historyByStatus.get(step);

                    return (
                      <div
                        key={step}
                        className={cn(
                          'relative flex gap-4 transition-opacity duration-300',
                          isFuture && 'opacity-40'
                        )}
                      >
                        {/* Node */}
                        <div className="relative z-10 shrink-0">
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-full border-4 border-card transition-all duration-500',
                              isPast &&
                                'bg-success text-success-foreground shadow-[0_0_0_4px] shadow-success/15',
                              isActive &&
                                'bg-primary text-primary-foreground shadow-[0_0_0_5px] shadow-primary/15',
                              isFuture &&
                                'bg-muted text-muted-foreground'
                            )}
                          >
                            {isPast && (
                              <Check size={14} strokeWidth={3} />
                            )}

                            {isActive && (
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
                                <span className="relative h-2.5 w-2.5 rounded-full bg-current" />
                              </span>
                            )}

                            {isFuture && (
                              <span className="h-2 w-2 rounded-full bg-current" />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p
                                className={cn(
                                  'text-sm font-semibold',
                                  isFuture
                                    ? 'text-muted-foreground'
                                    : 'text-foreground'
                                )}
                              >
                                {STATUS_CONFIG[step]?.label}
                              </p>

                              {isActive && (
                                <p className="mt-0.5 text-xs font-medium text-primary">
                                  Status saat ini
                                </p>
                              )}
                            </div>

                            {isPast && (
                              <CheckCircle2
                                size={15}
                                className="mt-0.5 shrink-0 text-success"
                              />
                            )}
                          </div>

                          {timestamp ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(timestamp).toLocaleString(
                                'id-ID',
                                {
                                  dateStyle: 'long',
                                  timeStyle: 'short',
                                }
                              )}{' '}
                              WIB
                            </p>
                          ) : (
                            <p className="mt-1 text-xs italic text-muted-foreground/50">
                              Belum tersedia
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Due date */}
        {!isCancelled && data.dueDate && (
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary-subtle p-4 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-700">
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl"
            />

            <div className="relative flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                  Estimasi Selesai
                </p>

                <p className="mt-1 text-sm font-bold text-foreground">
                  {new Date(data.dueDate).toLocaleDateString(
                    'id-ID',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order details */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 border-border/80 bg-card/90 shadow-sm backdrop-blur duration-700">
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingBag size={16} className="text-muted-foreground" />
              Rincian Order
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="divide-y divide-border/70">
              {data.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
                >
                  <span className="text-sm font-medium text-foreground">
                    {item.itemName}
                  </span>

                  <Badge
                    variant="secondary"
                    className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                  >
                    ×{item.qty}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="pb-4 pt-1 text-center text-xs text-muted-foreground">
          Informasi status akan diperbarui secara berkala.
        </p>
      </div>
    </main>
  );
}