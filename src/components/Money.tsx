// coteadmin/src/components/Money.tsx
import { formatRupiah, formatCompactRupiah } from '@/lib/format';

export function Money({ value, compact = false }: { value: number; compact?: boolean }) {
  return <span className="money-value">{compact ? formatCompactRupiah(value) : formatRupiah(value)}</span>;
}