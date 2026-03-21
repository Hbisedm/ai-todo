'use client';

import { useTheme } from 'next-themes';

export function ThemeSwitcher({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label={label}
      className="ghost-link"
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
      }}
      type="button"
    >
      {resolvedTheme === 'light' ? 'Light' : 'Dark'}
    </button>
  );
}
