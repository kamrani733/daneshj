import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  title: string;
  tone?: 'primary' | 'secondary';
  align?: 'start' | 'center' | 'end';
  /**
   * `headline` = section title (28/36); `title` = sub-section title;
   * `responsive` = title on phones, headline from 834 (home sections).
   */
  size?: 'headline' | 'title' | 'responsive';
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
};

/** Bar + title. The bar comes first so it sits at the start (right) in RTL, as in Figma. */
export function SectionHeading({
  title,
  tone = 'primary',
  align = 'center',
  size = 'headline',
  as: Tag = 'h2',
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
      <span
        aria-hidden
        className={cn(
          'shrink-0 rounded-[2px]',
          tone === 'primary' ? 'bg-primary' : 'bg-secondary',
          size === 'headline'
            ? tone === 'primary'
              ? 'h-8 w-3'
              : 'h-7 w-2'
            : size === 'title'
              ? 'h-6 w-1.5'
              : 'h-6 w-1.5 min-[834px]:h-7 min-[834px]:w-2'
        )}
      />
      <Tag
        className={cn(
          'font-bold text-on-primary-container',
          size === 'headline'
            ? 'text-headline-medium'
            : size === 'title'
              ? 'text-title-large'
              : 'text-title-large min-[834px]:text-headline-medium'
        )}
      >
        {title}
      </Tag>
    </div>
  );
}
