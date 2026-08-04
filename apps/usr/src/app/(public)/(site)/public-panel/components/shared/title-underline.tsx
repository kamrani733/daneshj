import { cn } from '@/lib/utils';

type TitleUnderlineProps = {
  className?: string;
};

/** Green underline motif shared by public-panel section titles. */
export function TitleUnderline({ className }: TitleUnderlineProps) {
  return (
    <span
      aria-hidden
      className={cn('h-0 w-full border-b-2 border-[#008D63]', className)}
    />
  );
}
