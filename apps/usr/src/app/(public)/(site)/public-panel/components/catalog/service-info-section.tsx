'use client';

import { useTranslations } from 'next-intl';

import type {
  PublicPanelSocialLink,
  ServiceCatalog,
} from '@public-panel/data/public-panel-mock';

import { PublicPanelTabs } from './public-panel-tabs';
import { SectionTitle } from './section-title';
import { SocialLinksRow } from './social-links-row';

type ServiceInfoSectionProps = {
  links: PublicPanelSocialLink[];
  catalog: ServiceCatalog;
  otherInfo: string[];
};

/** Figma «اطلاعات سرویس دهندگی» — title, filled socials, catalog tabs. */
export function ServiceInfoSection({
  links,
  catalog,
  otherInfo,
}: ServiceInfoSectionProps) {
  const t = useTranslations('publicPanel');

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <SectionTitle title={t('serviceInfo')} className="justify-center" />
      <SocialLinksRow
        links={links}
        size="lg"
        variant="filled"
        className="justify-center gap-4"
      />
      <PublicPanelTabs catalog={catalog} otherInfo={otherInfo} />
    </section>
  );
}
