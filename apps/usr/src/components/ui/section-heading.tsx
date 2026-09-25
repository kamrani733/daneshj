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
        'inline-flex items-center gap-2 px-2',
        align === 'center' && 'justify-center',
        align === 'start' && 'justify-start',
        align === 'end' && 'justify-end',
        className
      )}
    >
      <h2 className="text-headline-medium font-bold text-on-primary-container">{title}</h2>
      <span
        aria-hidden
        className={cn(
          'shrink-0 rounded-[2px]',
          tone === 'primary' ? 'h-8 w-3 bg-primary' : 'h-6 w-2 bg-secondary'
        )}
      />
    </div>
  );
}
