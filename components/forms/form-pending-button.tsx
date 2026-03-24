'use client';

import { useFormStatus } from 'react-dom';

import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function FormPendingButton({
  idleLabel,
  pendingLabel,
  className,
  variant = 'accent'
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  variant?: 'accent' | 'ghost' | 'danger';
}) {
  const { pending } = useFormStatus();
  const classes = [className, variant === 'ghost' ? 'site-link' : '', variant === 'danger' ? 'danger-button' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes || undefined} disabled={pending} type="submit">
      {pending ? <LoadingSpinner /> : null}
      <span>{pending ? pendingLabel : idleLabel}</span>
    </button>
  );
}
