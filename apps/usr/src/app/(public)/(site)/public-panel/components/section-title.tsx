import { AccentMark } from '@/components/site/accent-mark';
import { cn } from '@/lib/utils';

type SectionTitleProps = {
  title: string;
  className?: string;
  markSize?: 'md' | 'lg';
};

/** Section heading with orange accent — Figma title mark. */
export function SectionTitle({
  title,
  className,
  markSize = 'md',
}: SectionTitleProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <AccentMark size={markSize} />
      <h2 className="text-xl font-bold leading-7 text-primary-700 dark:text-primary-100">
        {title}
      </h2>
    </div>
  );
}
