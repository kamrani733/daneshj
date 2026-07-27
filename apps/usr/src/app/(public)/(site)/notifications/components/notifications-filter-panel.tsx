'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type ReactNode } from 'react';

import {
  EMPTY_NOTIFICATION_FILTERS,
  FILTER_CATEGORY_TREE,
  type FilterCategoryOption,
  type NotificationFilterStatus,
  type NotificationsFilterValues,
} from '@notifications/data/notifications-filter-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NotificationsFilterPanelProps = {
  filters: NotificationsFilterValues;
  onApply: (filters: NotificationsFilterValues) => void;
  onClear: () => void;
};

/**
 * Figma Notification filter — accordion fields inside toolbar expand.
 * Desktop: 2-col (sent/status/categories | read). Mobile: stacked.
 */
export function NotificationsFilterPanel({
  filters,
  onApply,
  onClear,
}: NotificationsFilterPanelProps) {
  const t = useTranslations('notifications.filter');
  const [draft, setDraft] = useState(filters);
  const [openFields, setOpenFields] = useState<Set<string>>(
    () => new Set(['sent', 'status'])
  );

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const patchDraft = (patch: Partial<NotificationsFilterValues>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const toggleField = (id: string) => {
    setOpenFields((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStatus = (status: NotificationFilterStatus) => {
    setDraft((prev) => {
      const has = prev.statuses.includes(status);
      return {
        ...prev,
        statuses: has
          ? prev.statuses.filter((s) => s !== status)
          : [...prev.statuses, status],
      };
    });
  };

  const toggleCategory = (id: string) => {
    setDraft((prev) => {
      const has = prev.categoryIds.includes(id);
      return {
        ...prev,
        categoryIds: has
          ? prev.categoryIds.filter((c) => c !== id)
          : [...prev.categoryIds, id],
      };
    });
  };

  return (
    <div dir="rtl" className="flex flex-col">
      <div className="flex w-full flex-col gap-0 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col">
          <FilterField
            id="sent"
            label={t('fields.sentRange')}
            open={openFields.has('sent')}
            onToggle={() => toggleField('sent')}
          >
            <DateRangeInputs
              startLabel={t('fields.rangeStart')}
              endLabel={t('fields.rangeEnd')}
              placeholder={t('fields.datePlaceholder')}
              hint={t('fields.dateHint')}
              startValue={draft.sentStart}
              endValue={draft.sentEnd}
              onStartChange={(sentStart) => patchDraft({ sentStart })}
              onEndChange={(sentEnd) => patchDraft({ sentEnd })}
            />
          </FilterField>

          <FilterField
            id="status"
            label={t('fields.status')}
            open={openFields.has('status')}
            onToggle={() => toggleField('status')}
          >
            <div className="flex flex-wrap items-center gap-6 px-3 pb-3">
              <FilterCheckbox
                checked={draft.statuses.includes('read')}
                label={t('status.read')}
                onChange={() => toggleStatus('read')}
              />
              <FilterCheckbox
                checked={draft.statuses.includes('unread')}
                label={t('status.unread')}
                onChange={() => toggleStatus('unread')}
              />
            </div>
          </FilterField>

          <FilterField
            id="categories"
            label={t('fields.categories')}
            open={openFields.has('categories')}
            onToggle={() => toggleField('categories')}
          >
            <CategoryTree
              options={FILTER_CATEGORY_TREE}
              selected={draft.categoryIds}
              onToggle={toggleCategory}
            />
          </FilterField>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <FilterField
            id="read"
            label={t('fields.readRange')}
            open={openFields.has('read')}
            onToggle={() => toggleField('read')}
          >
            <DateRangeInputs
              startLabel={t('fields.rangeStart')}
              endLabel={t('fields.rangeEnd')}
              placeholder={t('fields.datePlaceholder')}
              hint={t('fields.dateHint')}
              startValue={draft.readStart}
              endValue={draft.readEnd}
              onStartChange={(readStart) => patchDraft({ readStart })}
              onEndChange={(readEnd) => patchDraft({ readEnd })}
            />
          </FilterField>
        </div>
      </div>

      <div dir="ltr" className="flex items-center gap-2 px-4 py-5 pe-6 ps-4">
        <Button
          type="button"
          size="pillSm"
          onClick={() => onApply(draft)}
        >
          {t('apply')}
        </Button>
        <Button
          type="button"
          variant="soft"
          size="pillSm"
          onClick={() => {
            setDraft(EMPTY_NOTIFICATION_FILTERS);
            onClear();
          }}
        >
          {t('clear')}
        </Button>
      </div>
    </div>
  );
}

function FilterField({
  id,
  label,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <Button
        type="button"
        variant="toolbar"
        size="field"
        dir="ltr"
        aria-expanded={open}
        aria-controls={`notifications-filter-${id}`}
        onClick={onToggle}
        className="justify-between gap-3 text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/5"
      >
        <ChevronDown
          className={cn(
            'size-6 shrink-0 text-home-filter-muted transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
        <span className="truncate text-base font-medium leading-6 tracking-[0.0094em]">
          {label}
        </span>
      </Button>
      {open ? (
        <div id={`notifications-filter-${id}`} className="px-1 pb-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function DateRangeInputs({
  startLabel,
  endLabel,
  placeholder,
  hint,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
}: {
  startLabel: string;
  endLabel: string;
  placeholder: string;
  hint: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-2 pb-2 min-[640px]:flex-row min-[640px]:items-start">
      <FilterDateField
        label={startLabel}
        placeholder={placeholder}
        hint={hint}
        value={startValue}
        onChange={onStartChange}
      />
      <FilterDateField
        label={endLabel}
        placeholder={placeholder}
        hint={hint}
        value={endValue}
        onChange={onEndChange}
      />
    </div>
  );
}

function FilterDateField({
  label,
  placeholder,
  hint,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex w-full min-w-0 flex-1 flex-col gap-1">
      <span className="absolute -top-2 end-3 z-10 rounded-sm bg-white px-1.5 text-xs leading-4 text-home-filter-ink dark:bg-home-card dark:text-home-filter-ink">
        {label}
      </span>
      <span className="flex h-14 items-center gap-2 rounded border border-home-filter bg-white px-3 dark:bg-home-search-fill">
        <Calendar
          className="size-5 shrink-0 text-home-filter-ink"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-end text-sm leading-5 text-home-filter-ink',
            'outline-none placeholder:text-home-filter-muted',
            '[color-scheme:light] dark:[color-scheme:dark]'
          )}
        />
      </span>
      <span className="px-1 text-xs leading-4 tracking-[0.0083em] text-home-filter-muted">
        {hint}
      </span>
    </label>
  );
}

function FilterCheckbox({
  checked,
  label,
  onChange,
  className,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2 text-sm font-medium leading-5 text-home-filter-ink',
        className
      )}
    >
      {/* RTL: checkbox first → sits on the right (start) */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          'size-4 shrink-0 rounded-[2px] border-home-filter-border bg-transparent',
          'accent-primary checked:border-primary',
          'dark:border-home-filter-muted dark:accent-primary'
        )}
      />
      <span className="min-w-0 flex-1 truncate text-start">{label}</span>
    </label>
  );
}

function CategoryTree({
  options,
  selected,
  onToggle,
  depth = 0,
}: {
  options: FilterCategoryOption[];
  selected: string[];
  onToggle: (id: string) => void;
  depth?: number;
}) {
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
              {/* RTL: checkbox+label first (right), chevron last (left) */}
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
                  className="flex size-6 shrink-0 items-center justify-center text-home-filter-muted"
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
            {hasChildren && isOpen ? (
              <CategoryTree
                options={option.children!}
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
