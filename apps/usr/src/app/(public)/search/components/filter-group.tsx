'use client';

import type { ReactNode } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type FilterGroupProps = {
  /** Group title, e.g. «دسته بندی های اصلی و فرعی». */
  label: string;
  children: ReactNode;
};

const GROUP_VALUE = 'group';

/**
 * Collapsible filter group (Figma: title in primary + chevron up while open, on-surface + chevron
 * down while closed). The trigger is one column wide so its chevron lines up with the first column.
 * Open by default.
 */
export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <Accordion type="single" collapsible defaultValue={GROUP_VALUE}>
      <AccordionItem value={GROUP_VALUE}>
        <div className="grid grid-cols-1 gap-x-6 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
          <AccordionTrigger className="justify-between py-3 font-normal text-on-surface hover:text-primary data-[state=open]:text-primary dark:text-on-surface dark:data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
            <span className="text-label-large">{label}</span>
          </AccordionTrigger>
        </div>
        <AccordionContent className="pb-0 pt-1">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
