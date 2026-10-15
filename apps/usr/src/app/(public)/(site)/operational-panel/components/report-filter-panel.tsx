'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DateRangeInputs, FilterCheckbox, FilterField } from '@/components/ui/filter-fields';

import { REPORT_ENUMS, type ReportDefinition, type ReportFilters } from '@operational-panel/types';
import { enumFilterColumns } from '@operational-panel/utils/report-params';

type ReportFilterPanelProps = {
  definition: ReportDefinition;
  filters: ReportFilters;
  onApply: (filters: ReportFilters) => void;
  onClear: () => void;
};

const EMPTY_FILTERS: ReportFilters = { from: '', to: '', values: {} };

/**
 * Provisional filters (no filter design or SRS except `Usr-Rfl-2N1`): date range on the main date column
 * plus one checkbox group per closed-set column. Applied on «اعمال فیلتر».
 */
export function ReportFilterPanel({ definition, filters, onApply, onClear }: ReportFilterPanelProps) {
  const t = useTranslations('operationalPanel');
  const tFilter = useTranslations('operationalPanel.filters');
  const [draft, setDraft] = useState(filters);
  const enumColumns = enumFilterColumns(definition);
  const [openFields, setOpenFields] = useState<Set<string>>(
    () => new Set(['date', ...enumColumns.map((column) => column.key)])
  );
  const idPrefix = `${definition.id}-filter`;

  const toggleField = (id: string) =>
    setOpenFields((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleValue = (column: string, value: string) =>
    setDraft((current) => {
      const selected = current.values[column] ?? [];
      const nextSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      return { ...current, values: { ...current.values, [column]: nextSelected } };
    });

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 min-[834px]:grid-cols-2">
        <FilterField
          id="date"
          idPrefix={idPrefix}
          label={
            definition.dateFilterLabel
              ? t(`reports.${definition.id}.dateFilter`)
              : t(`reports.${definition.id}.columns.${definition.dateColumn}`)
          }
          open={openFields.has('date')}
          onToggle={() => toggleField('date')}
        >
          <DateRangeInputs
            startLabel={tFilter('from')}
            endLabel={tFilter('to')}
            placeholder={tFilter('datePlaceholder')}
            hint={tFilter('dateHint')}
            startValue={draft.from}
            endValue={draft.to}
            onStartChange={(from) => setDraft((current) => ({ ...current, from }))}
            onEndChange={(to) => setDraft((current) => ({ ...current, to }))}
          />
        </FilterField>

        {enumColumns.map((column) => (
          <FilterField
            key={column.key}
            id={column.key}
            idPrefix={idPrefix}
            label={t(`reports.${definition.id}.columns.${column.key}`)}
            open={openFields.has(column.key)}
            onToggle={() => toggleField(column.key)}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-3 pb-3">
              {REPORT_ENUMS[column.enumId].map((value) => (
                <FilterCheckbox
                  key={value}
                  checked={(draft.values[column.key] ?? []).includes(value)}
                  label={t(`enums.${column.enumId}.${value}`)}
                  onChange={() => toggleValue(column.key, value)}
                />
              ))}
            </div>
          </FilterField>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 px-4 py-4">
        <Button
          type="button"
          variant="link"
          onClick={() => {
            setDraft(EMPTY_FILTERS);
            onClear();
          }}
          className="h-auto px-0"
        >
          <span className="text-label-large">{tFilter('clear')}</span>
        </Button>
        <Button type="button" size="pillSm" onClick={() => onApply(draft)}>
          {tFilter('apply')}
        </Button>
      </div>
    </div>
  );
}
