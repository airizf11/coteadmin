// coteadmin/src/app/(app)/reports/advanced/ReportTabs.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Tab = { id: string; label: string; content: React.ReactNode };

export function ReportTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer',
              active === t.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}