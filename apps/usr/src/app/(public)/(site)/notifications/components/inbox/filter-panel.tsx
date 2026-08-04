'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  EMPTY_NOTIFICATION_FILTERS,
  FILTER_CATEGORY_TREE,
  type NotificationFilterStatus,
  type NotificationsFilterValues,
} from '@notifications/data/notifications-filter-data';
import { Button } from '@/components/ui/button';

import {
  CategoryTree,
  DateRangeInputs,
  FilterCheckbox,
  FilterField,
} from '../shared/filter-primitives';

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
            idPrefix="notifications-filter"
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
            idPrefix="notifications-filter"
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
            idPrefix="notifications-filter"
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
            idPrefix="notifications-filter"
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
