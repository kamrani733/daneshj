import { SectionHeading } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

type SectionTitleProps = {
  title: string;
  className?: string;
  align?: 'start' | 'center';
};

/** Public-panel section title: secondary bar heading (Public Panel export). */
export function SectionTitle({
  title,
  className,
  align = 'center',
}: SectionTitleProps) {
  return (
    <SectionHeading
      title={title}
      tone="secondary"
      align={align}
      className={cn(align === 'start' && 'self-start', className)}
    />
  );
}
