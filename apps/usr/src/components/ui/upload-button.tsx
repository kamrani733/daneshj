'use client';

import { Upload } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type UploadButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function UploadButton({
  children,
  icon,
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: UploadButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full',
        'bg-[#ffdbcf] px-5 text-sm font-medium text-[#72351f]',
        'transition-colors hover:bg-[#ffcdb8]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e06333]/40',
        'disabled:pointer-events-none disabled:opacity-50',
        fullWidth ? 'w-full' : 'min-w-[168px]',
        className
      )}
      {...props}
    >
      {icon ?? (
        <Upload className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
      )}
      <span>{children}</span>
    </button>
  );
}
