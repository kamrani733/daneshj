'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId, useState, type ComponentProps } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import type { SearchCategoryOption } from '@search/types';
import { leafIds } from '@search/utils/category-tree';

type CategoryFilterLayout = 'tree' | 'compact';

type CategoryFilterListProps = {
  options: SearchCategoryOption[];
  /** Selected leaf ids. */
  value: string[];
  onChange: (value: string[]) => void;
  /**
   * `tree` = main categories in 1 / 2 / 3 columns with a chevron for sub-categories
   * (محصولات, سرویس‌ها). `compact` = short flat options side by side (سرویس دهنده‌ها, کاربران).
   */
  layout?: CategoryFilterLayout;
};

/**
 * Figma filter checklists. A main category is checked when all its subs are checked,
 * indeterminate when some are.
 */
export function CategoryFilterList({
  options,
  value,
  onChange,
  layout = 'tree',
}: CategoryFilterListProps) {
  return (
    <ul
      className={
        layout === 'tree'
          ? 'grid grid-cols-1 items-start gap-x-6 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3'
          : 'flex flex-wrap gap-x-6 gap-y-2'
      }
    >
      {options.map((option) => (
        <CategoryFilterItem
          key={option.id}
          option={option}
          value={value}
          onChange={onChange}
          layout={layout}
        />
      ))}
    </ul>
  );
}

/** Checkbox inside the M3 40 px state layer (hover tint follows the whole row). */
function CheckboxTarget({
  checked,
  onCheckedChange,
}: Pick<ComponentProps<typeof Checkbox>, 'checked' | 'onCheckedChange'>) {
  return (
    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors group-hover/option:bg-on-surface/8">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
    </span>
  );
}

function CategoryFilterItem({
  option,
  value,
  onChange,
  layout,
}: {
  option: SearchCategoryOption;
  value: string[];
  onChange: (value: string[]) => void;
  layout: CategoryFilterLayout;
}) {
  const t = useTranslations('search.filter');
  const [open, setOpen] = useState(false);
  const subListId = useId();
  const children = option.children ?? [];
  const ids = leafIds(option);
  const selectedCount = ids.filter((id) => value.includes(id)).length;
  const checked =
    selectedCount === 0
      ? false
      : selectedCount === ids.length
        ? true
        : 'indeterminate';

  const setIds = (target: string[], on: boolean) => {
    const rest = value.filter((id) => !target.includes(id));
    onChange(on ? [...rest, ...target] : rest);
  };

  return (
    <li
      className={cn(
        'flex min-w-0 flex-col',
        layout === 'compact' && 'w-36 min-[1024px]:w-56',
      )}
    >
      <div className="flex min-h-13 items-center gap-2 py-1.5">
        <label className="group/option flex min-w-0 flex-1 cursor-pointer items-center gap-2">
          <CheckboxTarget
            checked={checked}
            onCheckedChange={() => setIds(ids, checked !== true)}
          />
          {/* Figma: main categories medium, flat options regular; long labels wrap. */}
          <span
            className={`text-body-medium text-on-surface ${layout === 'tree' ? 'font-medium' : ''}`}
          >
            {option.label}
          </span>
        </label>
        {children.length > 0 ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={open ? subListId : undefined}
            aria-label={t('toggleSubcategories', { label: option.label })}
            onClick={() => setOpen((current) => !current)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-on-surface/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <ChevronDown
              className={cn(
                'size-6 transition-transform',
                open && 'rotate-180',
              )}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        ) : null}
      </div>

      {children.length > 0 && open ? (
        <ul id={subListId} className="flex flex-col ps-6">
          {children.map((child) => (
            <li key={child.id}>
              <label className="group/option flex min-h-12 cursor-pointer items-center gap-2 py-1">
                <CheckboxTarget
                  checked={value.includes(child.id)}
                  onCheckedChange={(next) => setIds([child.id], next === true)}
                />
                <span className="text-body-medium text-on-surface-variant">
                  {child.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
