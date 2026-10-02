import { SectionTitle } from '@home/components/section-title';
import { ViewAllLink } from '@home/components/view-all-link';

type HomeCarouselSectionHeaderProps = {
  title: string;
  viewAllLabel: string;
  viewAllHref?: string;
};

/** Section bar title at the start (right) and «مشاهده همه» at the end (left), one row. */
export function HomeCarouselSectionHeader({
  title,
  viewAllLabel,
  viewAllHref,
}: HomeCarouselSectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <SectionTitle title={title} />
      <ViewAllLink label={viewAllLabel} href={viewAllHref} className="px-2 text-sm min-[834px]:text-base" />
    </div>
  );
}
