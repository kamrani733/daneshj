import { Pencil, Stamp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import type { FieldsMode } from '@private-panel/utils/fields-section-utils';

export function ModeTabs({
  mode,
  onModeChange,
  t,
}: {
  mode: FieldsMode;
  onModeChange: (mode: FieldsMode) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const triggerClass = cn(
    'h-full flex-1 items-center justify-center gap-2 rounded-none border-0 border-b-2 border-transparent',
    'text-sm font-medium text-[#404943] shadow-none',
    'data-[state=active]:border-b-[#008d63] data-[state=active]:bg-transparent',
    'data-[state=active]:font-bold data-[state=active]:text-[#171d19]',
    'data-[state=active]:shadow-none dark:text-home-filter-ink',
    'dark:data-[state=active]:border-b-primary-100 dark:data-[state=active]:text-primary-100',
  );

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => onModeChange(value as FieldsMode)}
      dir="rtl"
      className="w-full max-w-[360px] self-start"
    >
      <TabsList
        className={cn(
          'flex h-12 w-full items-stretch justify-center gap-0',
          'rounded-none border-b border-[#dbd8d1] bg-transparent p-0',
          'dark:border-auth-input-border',
        )}
      >
        <TabsTrigger value="view" className={triggerClass}>
          <Pencil className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="whitespace-nowrap text-center">
            {t('modes.view')}
          </span>
        </TabsTrigger>
        <TabsTrigger value="review" className={triggerClass}>
          <Stamp className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="whitespace-nowrap text-center">
            {t('modes.review')}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function IntroBullets({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <ul className="flex w-full flex-col gap-4">
      {[0, 1, 2].map((index) => (
        <li key={index} className="flex w-full items-start gap-2.5">
          <span
            aria-hidden
            className="mt-2 size-1.5 shrink-0 rounded-full bg-[#008d63]"
          />
          <p className="min-w-0 flex-1 text-justify text-sm font-medium leading-6 text-[#171d19] dark:text-home-filter-ink">
            {index === 1 ? (
              <>
                {t('intro.requiredBefore')}
                <span className="px-0.5 font-bold text-warning">*</span>
                {t('intro.requiredAfter')}
              </>
            ) : (
              t(`intro.p${index + 1}` as 'intro.p1' | 'intro.p3')
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
