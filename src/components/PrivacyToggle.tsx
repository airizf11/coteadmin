// coteadmin/src/components/PrivacyToggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PrivacyToggle() {
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setIsPrivate(document.documentElement.classList.contains('privacy-mode'));
  }, []);

  function toggle() {
    const next = !isPrivate;
    setIsPrivate(next);
    document.documentElement.classList.toggle('privacy-mode', next);
    localStorage.setItem('privacyMode', next ? '1' : '0');
  }

  return (
    <button
      onClick={toggle}
      aria-label={isPrivate ? 'Tampilkan nominal' : 'Sembunyikan nominal'}
      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      {isPrivate ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}