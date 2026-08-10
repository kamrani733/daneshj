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

/** RTL: first item sits on the right. */
const SUB_TABS: PublicOpsSubTab[] = ['createDelete', 'manageVisibility'];

/** Public panel operations — underline sub-tabs + panels. */
export function PublicOpsSection() {
  const t = useTranslations('privatePanel.publicOps');

  return (
    <Tabs
      defaultValue="createDelete"
      className="flex w-full flex-col gap-6"
      dir="rtl"
    >
      <TabsList
        className={cn(
          'flex h-auto w-full flex-wrap items-end justify-start gap-6',
          'rounded-none border-b border-border bg-transparent p-0'
        )}
      >
        {SUB_TABS.map((id) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'h-auto min-w-0 rounded-none border-0 border-b-2 border-transparent px-0 pb-3',
              'justify-center text-sm font-medium text-home-filter-muted shadow-none',
              'hover:text-primary focus-visible:ring-primary/30',
              'data-[state=active]:border-b-primary data-[state=active]:bg-transparent',
              'data-[state=active]:text-primary data-[state=active]:shadow-none',
              'dark:text-home-filter-ink dark:data-[state=active]:border-b-primary-100',
              'dark:data-[state=active]:text-primary-100'
            )}
          >
            <span>{t(`subTabs.${id}`)}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="manageVisibility" className="mt-0">
        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-home-card px-6 py-10 text-center text-sm text-home-filter-muted dark:bg-home-search-category">
          {t('managePlaceholder')}
        </div>
      </TabsContent>

      <TabsContent value="createDelete" className="mt-0">
        <CreateDeletePanel />
      </TabsContent>
    </Tabs>
  );
}
