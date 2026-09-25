import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CommentThreadProps = {
  children: ReactNode;
  repliesToggle?: ReactNode;
  replies?: ReactNode;
  className?: string;
  repliesClassName?: string;
};

export function CommentThread({
  children,
  repliesToggle,
  replies,
  className,
  repliesClassName,
}: CommentThreadProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {children}
      {repliesToggle}
      {replies ? (
        <div className={cn('flex flex-col gap-4 ps-12', repliesClassName)}>{replies}</div>
      ) : null}
    </div>
  );
}
