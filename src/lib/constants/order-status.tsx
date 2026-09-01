// coteadmin/src/lib/constants/order-status.tsx
import {
  CircleDashed,
  Loader2,
  PackageCheck,
  CheckCircle2,
  Ban,
  Play,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

export const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    icon: LucideIcon;
  }
> = {
  RECEIVED: {
    label: 'Diterima',
    color: 'bg-info/10 text-info border-info/20 hover:bg-info/20',
    icon: CircleDashed,
  },

  IN_PROCESS: {
    label: 'Diproses',
    color: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    icon: Loader2,
  },

  READY: {
    label: 'Siap Diambil',
    color:
      'bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/30',
    icon: PackageCheck,
  },

  DONE: {
    label: 'Selesai',
    color: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    icon: CheckCircle2,
  },

  CANCELLED: {
    label: 'Dibatalkan',
    color:
      'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    icon: Ban,
  },
};

// NOTE: statis dulu, samain sama ALLOWED_TRANSITIONS di backend orders.service.ts.
// Kalau fitur flow-per-tenant digarap nanti, ini titik yang diganti jadi
// function terima config tenant — bukan constant tetap kayak sekarang.

// V1
/* export const TRANSITIONS: Record<
  string,
  {
    status: string;
    label: string;
    danger?: boolean;
    icon: LucideIcon;
  }[]
> = {
  RECEIVED: [
    {
      status: 'IN_PROCESS',
      label: 'Mulai Proses',
      icon: Play,
    },
    {
      status: 'CANCELLED',
      label: 'Batalkan Order',
      danger: true,
      icon: XCircle,
    },
  ],

  IN_PROCESS: [
    {
      status: 'READY',
      label: 'Siap Diambil',
      icon: PackageCheck,
    },
    {
      status: 'CANCELLED',
      label: 'Batalkan Order',
      danger: true,
      icon: XCircle,
    },
  ],

  READY: [
    {
      status: 'DONE',
      label: 'Selesai / Sudah Diambil',
      icon: CheckCircle2,
    },
    {
      status: 'CANCELLED',
      label: 'Batalkan Order',
      danger: true,
      icon: XCircle,
    },
  ],

  DONE: [],

  CANCELLED: [],
}; */

// V2
const TRANSITION_META: Record<string, { label: string; icon: LucideIcon }> = {
  IN_PROCESS: { label: 'Mulai Proses', icon: Play },
  READY: { label: 'Siap Diambil', icon: PackageCheck },
  DONE: { label: 'Selesai / Sudah Diambil', icon: CheckCircle2 },
};

export function buildTransitions(enabledPhases: string[]) {
  const flow = ['RECEIVED', ...['IN_PROCESS', 'READY'].filter((p) => enabledPhases.includes(p)), 'DONE'];
  const transitions: Record<string, { status: string; label: string; danger?: boolean; icon: LucideIcon }[]> = {
    DONE: [], CANCELLED: [],
  };
  flow.forEach((status, i) => {
    if (status === 'DONE') return;
    const next = flow[i + 1];
    transitions[status] = [
      { status: next, ...TRANSITION_META[next] },
      { status: 'CANCELLED', label: 'Batalkan Order', danger: true, icon: XCircle },
    ];
  });
  return transitions;
}