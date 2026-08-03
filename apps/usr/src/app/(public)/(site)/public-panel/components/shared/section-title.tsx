import { cn } from '@/lib/utils';

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
      <h2 className="px-2 text-center text-[28px] font-bold leading-10 text-[#005138]">
        {title}
      </h2>
      <span
        aria-hidden
        className="h-0 w-full border-b-[2px] border-[#008D63]"
      />
    </div>
  );
}
