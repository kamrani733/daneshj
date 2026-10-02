import { SectionHeading } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

export type SectionTitleProps = {
  title: string;
  className?: string;
};

/** Home section title: secondary bar heading, start-aligned (home Figma, light + dark). */
export function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <SectionHeading
      title={title}
      tone="secondary"
      size="responsive"
      align="start"
      className={cn('self-start', className)}
    />
  );
}
