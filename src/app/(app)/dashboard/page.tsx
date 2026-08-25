// coteadmin/src/app/(app)/dashboard/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { getCurrentUserName, getCurrentUserEmail } from '@/lib/session';
import { Card, CardContent } from '@/components/ui/card';
import { STATUS_CONFIG } from '@/lib/constants/order-status';
import {
  Wallet,
  Clock,
  Users,
  ArrowRight,
  ListChecks,
  BarChart3,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { DashboardSkeleton } from './DashboardSkeleton';

type Overview = {
  ordersToday: number;
  revenueToday: number;
  activeOrders: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
};

type StatusBreakdown = Record<string, number>;

type StaffDashboard = {
  windowDays: number;
  totalOrders: number;
  statusBreakdown: StatusBreakdown;
};

const ROLE_LABEL: Record<string, string> = {
  DEV: 'Developer',
  OWNER: 'Pemilik',
  ADMIN: 'Admin',
  STAFF: 'Staf',
};

const ORDER_STATUSES = [
  'RECEIVED',
  'IN_PROCESS',
  'READY',
  'DONE',
  'CANCELLED',
];

export default async function DashboardPage() {
  const [name, email, membership] = await Promise.all([
    getCurrentUserName(),
    getCurrentUserEmail(),
    cotebek<{ data: { isMember: boolean; role: string | null } }>(
      '/auth/membership'
    ),
  ]);

  const role = membership.data.role ?? 'STAFF';
  const displayName = name ?? email?.split('@')[0] ?? 'Kak';

  return (
    <div className="p-4 pb-10 md:p-6 md:pb-12 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-info/5 blur-2xl" />

        <div className="relative p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles size={15} />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Dashboard
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground truncate">
                Halo, {displayName}!
              </h1>

              <p className="text-sm text-muted-foreground mt-1">
                {ROLE_LABEL[role] ?? role} · Pantau aktivitas dan performa
                usahamu.
              </p>
            </div>

            <div className="hidden sm:flex shrink-0 items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary border border-primary/10">
              <BarChart3 size={20} />
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData role={role} />
      </Suspense>
    </div>
  );
}

async function DashboardData({ role }: { role: string }) {
  if (role === 'STAFF') {
    const res = await cotebek<{ data: StaffDashboard }>(
      '/reports/staff-dashboard'
    );

    return <StaffView data={res.data} />;
  }

  const [overviewRes, breakdownRes] = await Promise.all([
    cotebek<{ data: Overview }>('/reports/overview'),
    cotebek<{ data: StatusBreakdown }>('/reports/status-breakdown'),
  ]);

  return (
    <AdminView
      overview={overviewRes.data}
      breakdown={breakdownRes.data}
    />
  );
}

function StatusGrid({ breakdown }: { breakdown: StatusBreakdown }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {ORDER_STATUSES.map((status) => {
        const config = STATUS_CONFIG[status];
        const Icon = config?.icon;

        return (
          <Card
            key={status}
            className={`shadow-sm border transition-all hover:-translate-y-0.5 hover:shadow-md ${
              config?.color ?? 'border-border bg-card'
            }`}
          >
            <CardContent className="p-3.5 md:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] sm:text-xs font-semibold opacity-80 truncate">
                  {config?.label ?? status}
                </span>

                {Icon && (
                  <Icon
                    size={16}
                    className="shrink-0 opacity-60"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="mt-2 text-xl md:text-2xl font-bold tracking-tight">
                {breakdown[status] ?? 0}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-3 px-1">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>

      {description && (
        <p className="text-xs text-muted-foreground mt-0.5">
          {description}
        </p>
      )}
    </div>
  );
}

function StaffView({ data: s }: { data: StaffDashboard }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionHeading
          title="Status Order"
          description={`${s.windowDays} hari terakhir`}
        />

        <StatusGrid breakdown={s.statusBreakdown} />
      </div>

      <Link
        href="/orders"
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="overflow-hidden border-primary/20 bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md group">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ListChecks size={22} />
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-foreground">
                    Total Order
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.windowDays} hari terakhir
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                  {s.totalOrders}
                </span>

                <ArrowRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

function AdminView({
  overview: o,
  breakdown,
}: {
  overview: Overview;
  breakdown: StatusBreakdown;
}) {
  return (
    <div className="space-y-6">
      <div>
        <SectionHeading
          title="Status Order"
          description="Ringkasan seluruh order sejak awal"
        />

        <StatusGrid breakdown={breakdown} />
      </div>

      {/* <Link
        href="/orders"
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="overflow-hidden border-primary/20 bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md group">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock size={22} />
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-foreground">
                    Order Berjalan
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5">
                    Order yang masih perlu diselesaikan
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                  {o.activeOrders}
                </span>

                <ArrowRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link> */}

      <div>
        <SectionHeading
          title="Ringkasan Bisnis"
          description="Performa utama bisnis"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            icon={<Wallet size={16} />}
            label="Omzet Hari Ini"
            value={`Rp${o.revenueToday.toLocaleString('id-ID')}`}
            tone="success"
          />

          <MetricCard
            icon={<ShoppingBag size={16} />}
            label="Order Hari Ini"
            value={o.ordersToday.toLocaleString('id-ID')}
            tone="info"
          />

          <MetricCard
            icon={<ListChecks size={16} />}
            label="Total Order"
            value={o.totalOrders.toLocaleString('id-ID')}
            tone="default"
            description="Sejak awal"
          />

          <Link
            href="/customers"
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MetricCard
              icon={<Users size={16} />}
              label="Total Pelanggan"
              value={o.totalCustomers.toLocaleString('id-ID')}
              tone="primary"
              interactive
            />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1 pt-1">
        <span className="text-xs text-muted-foreground">
          Total omzet sejak awal
        </span>

        <span className="text-sm font-bold text-success">
          Rp{o.totalRevenue.toLocaleString('id-ID')}
        </span>
      </div>

      <Link
        href="/reports"
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md group">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <BarChart3 size={19} />
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-foreground">
                    Laporan Lengkap
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5">
                    Lihat analisis dan export data
                  </div>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
  description,
  interactive = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'success' | 'info' | 'primary' | 'default';
  description?: string;
  interactive?: boolean;
}) {
  const toneClasses = {
    success: 'bg-success/10 text-success',
    info: 'bg-info/10 text-info',
    primary: 'bg-primary/10 text-primary',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <Card
      className={`h-full shadow-sm border-border bg-card transition-all ${
        interactive
          ? 'hover:border-primary/30 hover:shadow-md cursor-pointer'
          : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneClasses[tone]}`}
          >
            {icon}
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground truncate">
            {label}
          </span>
        </div>

        <div className="mt-3 text-lg md:text-xl font-bold tracking-tight text-foreground truncate">
          {value}
        </div>

        {description && (
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}