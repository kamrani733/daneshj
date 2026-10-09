'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { FilterCategoryOption } from '@notifications/types/filters';
import { FilterCheckbox } from '@/components/ui/filter-fields';
import { cn } from '@/lib/utils';

type CategoryTreeProps = {
  options: FilterCategoryOption[];
  selected: string[];
  onToggle: (id: string) => void;
  depth?: number;
};

export function CategoryTree({
  options,
  selected,
  onToggle,
  depth = 0,
}: CategoryTreeProps) {
  const t = useTranslations('notifications.filter.categories');
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(options.map((o) => o.id))
  );

  const toggleExpand = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ul className="flex max-h-64 flex-col overflow-y-auto px-2 pb-2">
      {options.map((option) => {
        const hasChildren = (option.children?.length ?? 0) > 0;
        const isOpen = expanded.has(option.id);
        return (
          <li key={option.id} className="flex flex-col">
            <div
              className="flex min-h-11 items-center gap-2"
              style={{ paddingInlineStart: depth * 16 }}
            >
              <FilterCheckbox
                checked={selected.includes(option.id)}
                label={t(option.labelKey)}
                onChange={() => onToggle(option.id)}
                className="min-w-0 flex-1"
              />
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={t(option.labelKey)}
                  onClick={() => toggleExpand(option.id)}
                  className="flex size-6 shrink-0 items-center justify-center text-app-filter-muted"
                >
                  <ChevronDown
                    className={cn(
                      'size-5 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </button>
              ) : (
                <span className="size-6 shrink-0" aria-hidden />
              )}
            </div>
            {hasChildren && isOpen && option.children ? (
              <CategoryTree
                options={option.children}
                selected={selected}
                onToggle={onToggle}
                depth={depth + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
