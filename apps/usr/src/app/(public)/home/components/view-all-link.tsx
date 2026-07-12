import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ViewAllLinkProps = {
  href?: string;
  label: string;
  className?: string;
};

/** Figma — M3/title/medium-Bold, warning-400 (#E06333). */
export function ViewAllLink({ href = '#', label, className }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1 text-base font-bold leading-6 tracking-[0.0094em] text-warning-400 transition-opacity hover:opacity-80',
        className
      )}
    >
      <span>{label}</span>
      <ChevronLeft className="size-5" aria-hidden />
    </Link>
  );
}
