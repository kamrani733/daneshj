import { cn } from '@/lib/utils';

import { SectionTitle } from './section-title';
import { ViewAllLink } from './view-all-link';

type HomeCarouselSectionHeaderProps = {
  title: string;
  viewAllLabel: string;
  /** Desktop title width override (discounts 239px · businesses 257px). */
  desktopTitleClassName?: string;
};

/** Shared title + view-all chrome for discount / business carousels. */
export function HomeCarouselSectionHeader({
  title,
  viewAllLabel,
  desktopTitleClassName,
}: HomeCarouselSectionHeaderProps) {
  return (
    <>
      <SectionTitle
        title={title}
        variant="narrow"
        className={cn(
          'hidden w-[239px] shrink-0 self-start min-[834px]:inline-flex',
          desktopTitleClassName
        )}
      />

      <div className="flex items-center justify-between min-[834px]:hidden">
        <ViewAllLink label={viewAllLabel} className="px-2" />
        <SectionTitle
          title={title}
          variant="narrow"
          className="!min-h-[49px] !w-auto !max-w-[139px] [&_h2]:pt-0 [&_h2]:text-base [&_h2]:leading-5 [&_img]:bottom-0 [&_img]:h-[38px] [&_img]:w-[123px]"
        />
      </div>
    </>
  );
}
