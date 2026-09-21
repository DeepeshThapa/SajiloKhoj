import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'neutral', size = 'md', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    primary: 'bg-blue-50/80 text-blue-700 border border-blue-200/60',
    secondary: 'bg-teal-50/80 text-teal-800 border border-teal-200/60',
    success: 'bg-emerald-50/80 text-emerald-800 border border-emerald-200/60',
    warning: 'bg-amber-50/80 text-amber-900 border border-amber-200/60',
    danger: 'bg-rose-50/80 text-rose-800 border border-rose-200/60',
    info: 'bg-sky-50/80 text-sky-800 border border-sky-200/60',
    neutral: 'bg-slate-100/90 text-slate-700 border border-slate-200/80',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {children}
    </span>
  );
}
