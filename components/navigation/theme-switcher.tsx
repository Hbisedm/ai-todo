'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ] as const;

  const currentLabel = mounted
    ? resolvedTheme === 'light'
      ? 'Light'
      : resolvedTheme === 'dark'
        ? 'Dark'
        : 'System'
    : label;

  return (
    <div className="switcher-menu">
      <button
        aria-expanded={open}
        aria-label={label}
        className="ghost-link"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {currentLabel}
      </button>
      {open ? (
        <div className="menu-popover" role="menu">
          {options.map((option) => (
            <button
              className="menu-item"
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setOpen(false);
              }}
              role="menuitem"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
