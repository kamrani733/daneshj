'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  FILTER_CATEGORY_TREE,
} from '@notifications/data/notifications-filter-data';
import type {
  ReportChannel,
  ReportPriority,
  ReportReadStatus,
} from '@notifications/api';
import { Button } from '@/components/ui/button';

import {
  CategoryTree,
  DateRangeInputs,
  FilterCheckbox,
  FilterField,
} from '../shared/filter-primitives';

export type ReportsFilterValues = {
  sentStart: string;
  sentEnd: string;
  priority?: ReportPriority;
  status?: ReportReadStatus;
  channel?: ReportChannel;
  categoryIds: string[];
};

export const EMPTY_REPORTS_FILTERS: ReportsFilterValues = {
  sentStart: '',
  sentEnd: '',
  categoryIds: [],
};

type ReportsFilterPanelProps = {
  filters: ReportsFilterValues;
  onApply: (filters: ReportsFilterValues) => void;
  onClear: () => void;
};

const PRIORITIES: ReportPriority[] = ['high', 'medium', 'low'];
const STATUSES: ReportReadStatus[] = ['read', 'unread'];
const CHANNELS: ReportChannel[] = [
  'site',
  'email',
  'sms',
  'telegram',
  'whatsapp',
];

/**
 * Figma گزارشات — فیلترها (desktop 2-col · mobile stacked accordion).
 * API: start_date, end_date, priority, status, channel, main/sub_category_id
 */
export function ReportsFilterPanel({
  filters,
  onApply,
  onClear,
}: ReportsFilterPanelProps) {
  const t = useTranslations('notifications.reports');
  const tFilter = useTranslations('notifications.filter');
  const [draft, setDraft] = useState(filters);
  const [openFields, setOpenFields] = useState<Set<string>>(
    () => new Set(['sent', 'status', 'priority'])
  );

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const patchDraft = (patch: Partial<ReportsFilterValues>) => {
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
    <div dir="rtl" className="flex flex-col border-t border-border/60">
      <div className="flex w-full flex-col gap-0 min-[834px]:flex-row min-[834px]:items-start">
        <div className="flex min-w-0 flex-1 flex-col">
          <FilterField
            id="sent"
            idPrefix="reports-filter"
            label={tFilter('fields.sentRange')}
            open={openFields.has('sent')}
            onToggle={() => toggleField('sent')}
          >
            <DateRangeInputs
              startLabel={tFilter('fields.rangeStart')}
              endLabel={tFilter('fields.rangeEnd')}
              placeholder={tFilter('fields.datePlaceholder')}
              hint={tFilter('fields.dateHint')}
              startValue={draft.sentStart}
              endValue={draft.sentEnd}
              onStartChange={(sentStart) => patchDraft({ sentStart })}
              onEndChange={(sentEnd) => patchDraft({ sentEnd })}
            />
          </FilterField>

          <FilterField
            id="status"
            idPrefix="reports-filter"
            label={t('columns.status')}
            open={openFields.has('status')}
            onToggle={() => toggleField('status')}
          >
            <div className="flex flex-wrap items-center gap-6 px-3 pb-3">
              {STATUSES.map((status) => (
                <FilterCheckbox
                  key={status}
                  checked={draft.status === status}
                  label={t(`status.${status}`)}
                  onChange={() =>
                    patchDraft({
                      status: draft.status === status ? undefined : status,
                    })
                  }
                />
              ))}
            </div>
          </FilterField>

          <FilterField
            id="categories"
            idPrefix="reports-filter"
            label={tFilter('fields.categories')}
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
            id="priority"
            idPrefix="reports-filter"
            label={t('columns.priority')}
            open={openFields.has('priority')}
            onToggle={() => toggleField('priority')}
          >
            <div className="flex flex-wrap items-center gap-6 px-3 pb-3">
              {PRIORITIES.map((priority) => (
                <FilterCheckbox
                  key={priority}
                  checked={draft.priority === priority}
                  label={t(`priority.${priority}`)}
                  onChange={() =>
                    patchDraft({
                      priority:
                        draft.priority === priority ? undefined : priority,
                    })
                  }
                />
              ))}
            </div>
          </FilterField>

          <FilterField
            id="channel"
            idPrefix="reports-filter"
            label={t('columns.channel')}
            open={openFields.has('channel')}
            onToggle={() => toggleField('channel')}
          >
            <div className="flex flex-wrap items-center gap-4 px-3 pb-3">
              {CHANNELS.map((channel) => (
                <FilterCheckbox
                  key={channel}
                  checked={draft.channel === channel}
                  label={t(`channel.${channel}`)}
                  onChange={() =>
                    patchDraft({
                      channel: draft.channel === channel ? undefined : channel,
                    })
                  }
                />
              ))}
            </div>
          </FilterField>
        </div>
      </div>

      <div dir="ltr" className="flex items-center gap-3 px-4 py-5 pe-6 ps-4">
        <Button type="button" size="pillSm" onClick={() => onApply(draft)}>
          {t('applyFilters')}
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => {
            setDraft(EMPTY_REPORTS_FILTERS);
            onClear();
          }}
          className="h-auto px-0 text-sm font-medium text-primary"
        >
          {t('clearFilters')}
        </Button>
      </div>
    </div>
  );
}
