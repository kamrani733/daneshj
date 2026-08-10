import type { SVGProps } from 'react';

import { cn } from '@/lib/utils';

type AvatarUserIconProps = SVGProps<SVGSVGElement>;

export function AvatarUserIcon({ className, ...props }: AvatarUserIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('shrink-0', className)}
      {...props}
    >
      <circle
        cx="12"
        cy="7.25"
        r="3.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M4.75 20.25c0-3.73 3.134-6.75 7.25-6.75s7.25 3.02 7.25 6.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}
