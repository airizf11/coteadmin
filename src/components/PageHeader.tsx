// coteadmin/src/components/PageHeader.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, backHref, backLabel, action }: PageHeaderProps) {
  if (backHref) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label={backLabel ?? 'Kembali'}
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}