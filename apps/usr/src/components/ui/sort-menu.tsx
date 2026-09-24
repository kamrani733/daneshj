import { ArrowUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export type SortMenuOption<T extends string> = {
  value: T;
  label: string;
};

type SortMenuProps<T extends string> = {
  value: T;
  options: SortMenuOption<T>[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

export function SortMenu<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: SortMenuProps<T>) {
  return (
    <label className={cn('relative inline-block shrink-0', className)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(
          'h-12 appearance-none rounded-full border border-outline-variant bg-transparent py-1.5 pe-3 ps-10',
          'text-start text-label-large font-medium text-on-surface-variant',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowUpDown
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant"
        aria-hidden
      />
    </label>
  );
}
