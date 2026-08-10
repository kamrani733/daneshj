'use client';

import { useTranslations } from 'next-intl';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { CreateDeletePanel } from './create-delete-panel';

type PublicOpsSubTab = 'manageVisibility' | 'createDelete';

/** RTL: first item sits on the right — manage first, create/delete second. */
const SUB_TABS: PublicOpsSubTab[] = ['manageVisibility', 'createDelete'];

/** Public panel operations — underline sub-tabs + panels. */
export function PublicOpsSection() {
  const t = useTranslations('privatePanel.publicOps');

  return (
    <Tabs
      defaultValue="createDelete"
      className="flex w-full flex-col gap-4 min-[720px]:gap-6"
      dir="rtl"
    >
      <TabsList
        className={cn(
          'flex h-auto w-full items-stretch justify-start gap-4 overflow-x-auto',
          'rounded-none border-b border-border bg-transparent p-0',
          'min-[720px]:gap-6'
        )}
      >
        {SUB_TABS.map((id) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'h-auto shrink-0 rounded-none border-0 border-b-2 border-transparent px-0 pb-2.5',
              'justify-center text-xs font-medium text-home-filter-muted shadow-none',
              'hover:text-primary focus-visible:ring-primary/30',
              'data-[state=active]:border-b-primary data-[state=active]:bg-transparent',
              'data-[state=active]:text-primary data-[state=active]:shadow-none',
              'dark:text-home-filter-ink dark:data-[state=active]:border-b-primary-100',
              'dark:data-[state=active]:text-primary-100',
              'min-[720px]:pb-3 min-[720px]:text-sm'
            )}
          >
            <span className="whitespace-nowrap">{t(`subTabs.${id}`)}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="manageVisibility" className="mt-0">
        <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-border bg-home-card px-4 py-8 text-center text-sm text-home-filter-muted min-[720px]:min-h-[180px] min-[720px]:px-6 min-[720px]:py-10 dark:bg-home-search-category">
          {t('managePlaceholder')}
        </div>
      </TabsContent>

      <TabsContent value="createDelete" className="mt-0">
        <CreateDeletePanel />
      </TabsContent>
    </Tabs>
  );
}
