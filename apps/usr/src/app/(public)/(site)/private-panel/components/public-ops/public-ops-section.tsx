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
import { ManageVisibilityPanel } from './manage-visibility-panel';

type PublicOpsSubTab = 'manageVisibility' | 'createDelete';

/** RTL: first item sits on the right — manage first, create/delete second. */
const SUB_TABS: PublicOpsSubTab[] = ['manageVisibility', 'createDelete'];

type PublicOpsSectionProps = {
  accessToken?: string | null;
  targetActorId?: number | null;
};

/** Public panel operations — underline sub-tabs + panels. */
export function PublicOpsSection({
  accessToken,
  targetActorId,
}: PublicOpsSectionProps) {
  const t = useTranslations('privatePanel.publicOps');
  const defaultSubTab: PublicOpsSubTab = targetActorId
    ? 'createDelete'
    : 'manageVisibility';

  return (
    <Tabs
      defaultValue={defaultSubTab}
      className="flex w-full flex-col gap-3 min-[720px]:gap-6"
      dir="rtl"
    >
      <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList
          className={cn(
            'flex h-auto w-max min-w-full items-stretch justify-start gap-4',
            'rounded-none border-b border-border bg-transparent p-0',
            'min-[720px]:w-full min-[720px]:gap-6'
          )}
        >
          {SUB_TABS.map((id) => (
            <TabsTrigger
              key={id}
              value={id}
              className={cn(
                'h-auto shrink-0 rounded-none border-0 border-b-2 border-transparent px-0 pb-2.5',
                'justify-center text-[11px] font-medium text-home-filter-muted shadow-none',
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
      </div>

      <TabsContent value="manageVisibility" className="mt-0">
        <ManageVisibilityPanel
          accessToken={accessToken}
          targetActorId={targetActorId}
        />
      </TabsContent>

      <TabsContent value="createDelete" className="mt-0">
        <CreateDeletePanel
          accessToken={accessToken}
          targetActorId={targetActorId}
        />
      </TabsContent>
    </Tabs>
  );
}
