import { cn } from '@/lib/utils';

import { TitleUnderline } from './title-underline';

type SectionTitleProps = {
  title: string;
  className?: string;
  /** Kept for call-site compat. */
  markSize?: 'md' | 'lg';
};

/** Middle title: centered green headline with thin underline. */
export function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-2 px-4',
        className
      )}
    >
      <h2 className="px-2 text-center text-[28px] font-bold leading-10 text-primary-700 dark:text-primary-100">
        {title}
      </h2>
      <TitleUnderline />
    </div>
  );
}
