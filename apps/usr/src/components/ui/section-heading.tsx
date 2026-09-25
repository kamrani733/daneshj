import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  title: string;
  tone?: 'primary' | 'secondary';
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export function SectionHeading({
  title,
  tone = 'primary',
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'inline-flex flex-col gap-2',
        align === 'center' && 'items-center',
        align === 'start' && 'items-start',
        align === 'end' && 'items-end',
        className
      )}
    >
      <h2
        className={cn(
          'px-2 text-headline-medium font-bold',
          tone === 'primary' ? 'text-primary' : 'text-secondary'
        )}
      >
        {title}
      </h2>
      <span
        aria-hidden
        className={cn(
          'h-0 w-full border-b-2',
          tone === 'primary' ? 'border-primary' : 'border-secondary'
        )}
      />
    </div>
  );
}
