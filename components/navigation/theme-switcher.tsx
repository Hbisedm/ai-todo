'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const options = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ] as const;

  return (
    <div className="switcher-menu">
      <button
        aria-expanded={open}
        aria-label={label}
        className="ghost-link"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {resolvedTheme === 'light' ? 'Light' : resolvedTheme === 'dark' ? 'Dark' : 'System'}
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
