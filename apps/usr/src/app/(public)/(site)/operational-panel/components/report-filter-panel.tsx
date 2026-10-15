'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DateRangeInputs, FilterCheckbox, FilterField, NumberRangeInputs } from '@/components/ui/filter-fields';
import { toFaDigits } from '@/lib/jalali';

import { REPORT_ENUMS, type ReportDefinition, type ReportFilters } from '@operational-panel/types';
import { EMPTY_REPORT_FILTERS, enumFilterColumns, parseRangeBound } from '@operational-panel/utils/report-params';

type ReportFilterPanelProps = {
  definition: ReportDefinition;
  filters: ReportFilters;
  onApply: (filters: ReportFilters) => void;
  onClear: () => void;
};

type RangeDraft = Record<string, { min: string; max: string }>;

/**
 * Date range on the main date column (or one per `dateFilterColumns`), «شروع بازه / پایان بازه» pairs for `rangeColumns` and one checkbox group
 * per closed-set column (Figma report filter frames). Applied on «اعمال فیلتر».
 */
export function ReportFilterPanel({ definition, filters, onApply, onClear }: ReportFilterPanelProps) {
  const t = useTranslations('operationalPanel');
  const tFilter = useTranslations('operationalPanel.filters');
  const [draft, setDraft] = useState(filters);
  const rangeColumns = definition.rangeColumns ?? [];
  const dateFilterColumns = definition.dateFilterColumns;
  const [rangeDraft, setRangeDraft] = useState<RangeDraft>(() =>
    Object.fromEntries(
      rangeColumns.map((column) => {
        const range = filters.ranges?.[column];
        return [column, { min: range?.min != null ? toFaDigits(range.min) : '', max: range?.max != null ? toFaDigits(range.max) : '' }];
      })
    )
  );
  const enumColumns = enumFilterColumns(definition);
  const [openFields, setOpenFields] = useState<Set<string>>(
    () =>
      new Set([
        'date',
        ...(dateFilterColumns ?? []).map((column) => `date-${column}`),
        ...rangeColumns,
        ...enumColumns.map((column) => column.key),
      ])
  );

  const setDateBound = (column: string, bound: 'from' | 'to', value: string) =>
    setDraft((current) => {
      const bounds = current.dates?.[column] ?? { from: '', to: '' };
      return { ...current, dates: { ...current.dates, [column]: { ...bounds, [bound]: value } } };
    });

  const setRangeBound = (column: string, bound: 'min' | 'max', value: string) =>
    setRangeDraft((current) => ({ ...current, [column]: { ...(current[column] ?? { min: '', max: '' }), [bound]: value } }));

  const apply = () => {
    const ranges = Object.fromEntries(
      rangeColumns.map((column) => [
        column,
        { min: parseRangeBound(rangeDraft[column]?.min ?? ''), max: parseRangeBound(rangeDraft[column]?.max ?? '') },
      ])
    );
    onApply({ ...draft, ranges });
  };
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
        {dateFilterColumns ? (
          dateFilterColumns.map((column) => (
            <FilterField
              key={column}
              id={`date-${column}`}
              idPrefix={idPrefix}
              label={t(`reports.${definition.id}.dateFilters.${column}`)}
              open={openFields.has(`date-${column}`)}
              onToggle={() => toggleField(`date-${column}`)}
            >
              <DateRangeInputs
                startLabel={tFilter('from')}
                endLabel={tFilter('to')}
                placeholder={tFilter('datePlaceholder')}
                hint={tFilter('dateHint')}
                startValue={draft.dates?.[column]?.from ?? ''}
                endValue={draft.dates?.[column]?.to ?? ''}
                onStartChange={(from) => setDateBound(column, 'from', from)}
                onEndChange={(to) => setDateBound(column, 'to', to)}
              />
            </FilterField>
          ))
        ) : (
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
        )}

        {rangeColumns.map((column) => (
          <FilterField
            key={column}
            id={column}
            idPrefix={idPrefix}
            label={t(`reports.${definition.id}.rangeFilter.${column}`)}
            open={openFields.has(column)}
            onToggle={() => toggleField(column)}
          >
            <NumberRangeInputs
              startLabel={tFilter('from')}
              endLabel={tFilter('to')}
              placeholder={tFilter('amountPlaceholder')}
              startValue={rangeDraft[column]?.min ?? ''}
              endValue={rangeDraft[column]?.max ?? ''}
              onStartChange={(value) => setRangeBound(column, 'min', value)}
              onEndChange={(value) => setRangeBound(column, 'max', value)}
            />
          </FilterField>
        ))}

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
            setDraft(EMPTY_REPORT_FILTERS);
            setRangeDraft({});
            onClear();
          }}
          className="h-auto px-0"
        >
          <span className="text-label-large">{tFilter('clear')}</span>
        </Button>
        <Button type="button" size="pillSm" onClick={apply}>
          {tFilter('apply')}
        </Button>
      </div>
    </div>
  );
}
