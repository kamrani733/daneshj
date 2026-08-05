'use client';

import { useTranslations } from 'next-intl';

import type {
  OtherInfoContent,
  PublicPanelSocialLink,
  ServiceCatalog,
} from '@public-panel/data/public-panel-ui';

import { PublicPanelTabs } from './tabs';
import { SectionTitle } from '../shared/section-title';
import { SocialLinksRow } from '../profile/social-links-row';

type ServiceInfoSectionProps = {
  links: PublicPanelSocialLink[];
  catalog: ServiceCatalog;
  otherInfo: OtherInfoContent;
};

/** Service info: title, socials, and catalog tabs. */
export function ServiceInfoSection({
  links,
  catalog,
  otherInfo,
}: ServiceInfoSectionProps) {
  const t = useTranslations('publicPanel');

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <SectionTitle title={t('serviceInfo')} className="mx-auto" />
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
