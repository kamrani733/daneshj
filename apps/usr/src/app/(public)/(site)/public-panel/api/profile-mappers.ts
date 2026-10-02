import type { PanelSocialLink } from '@/components/panel';
import { mapPublicPanelProfile } from '@private-panel/api/profile-mappers';
import {
  asArray,
  asRecord,
  pickSection,
  readRecordList,
  readString,
} from '@private-panel/utils/mapper-utils';
import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';
import type {
  ProfileRetrieveData,
  PublicPanelKind,
} from '@public-panel/types/actor';
import type {
  OtherInfoContent,
  PortfolioItem,
  PublicPanelProfile,
  ResumeFile,
} from '@public-panel/types/ui';
import { TARGET_TYPE } from '@public-panel/types/api';

function socialHref(
  network: PanelSocialLink['network'],
  value: string
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  switch (network) {
    case 'email':
      return trimmed.includes('@') ? `mailto:${trimmed}` : null;
    case 'telegram':
      return `https://t.me/${trimmed.replace(/^@/, '')}`;
    case 'instagram':
      return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
    case 'x':
      return `https://x.com/${trimmed.replace(/^@/, '')}`;
    case 'whatsapp':
      return `https://wa.me/${trimmed.replace(/\D/g, '')}`;
    case 'linkedin':
      return trimmed.startsWith('http')
        ? trimmed
        : `https://linkedin.com/in/${trimmed.replace(/^@/, '')}`;
    case 'website':
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    default:
      return null;
  }
}

function collectSocialLinks(
  contact: Record<string, unknown> | null
): PanelSocialLink[] {
  const links: PanelSocialLink[] = [];
  const candidates: Array<[PanelSocialLink['network'], string]> = [
    ['email', readString(contact, 'email')],
    ['telegram', readString(contact, 'telegram_id')],
    ['instagram', readString(contact, 'instagram_id')],
    ['x', readString(contact, 'twitter_id')],
    ['whatsapp', readString(contact, 'whatsapp_id')],
    ['linkedin', readString(contact, 'linkedin_id')],
    ['website', readString(contact, 'website')],
  ];
  for (const [network, value] of candidates) {
    const href = socialHref(network, value);
    if (href) links.push({ network, href });
  }
  return links;
}

function pickTranslation(
  parent: Record<string, unknown> | null,
  data: ProfileRetrieveData | null | undefined,
  key: string
): Record<string, unknown> | null {
  const nested = asArray(parent?.[key]);
  const rows = nested.length > 0 ? nested : readRecordList(data, key);
  const records = rows
    .map((item) => {
      const row = asRecord(item);
      const inner = asRecord(row?.data);
      return row && inner ? { ...row, ...inner } : row;
    })
    .filter((item): item is Record<string, unknown> => Boolean(item));
  return (
    records.find((item) => readString(item, 'target_language') === 'fa') ??
    records.find((item) => readString(item, 'target_language') === 'en') ??
    records[0] ??
    null
  );
}

function fileNameFromPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

function mapResume(
  data: ProfileRetrieveData | null | undefined
): ResumeFile | null {
  const section = pickSection(data, 'resume_individual');
  const list = section
    ? [section, ...asArray(section.resume_individual)]
    : readRecordList(data, 'resume_individual');
  const row =
    list
      .map((item) => asRecord(item))
      .find((item) => item && readString(item, 'file_path')) ?? section;
  const filePath = readString(row, 'file_path');
  if (!filePath) return null;
  const onlineLink = readString(row, 'online_link');
  return {
    fileName: fileNameFromPath(filePath),
    sizeLabel: readString(row, 'file_size') || readString(row, 'size') || '',
    updatedAt:
      readString(row, 'updated_at') ||
      readString(row, 'modified_at') ||
      '',
    href: filePath,
    previewHref: onlineLink || undefined,
  };
}

function mapPortfolio(
  data: ProfileRetrieveData | null | undefined
): PortfolioItem[] {
  const items: PortfolioItem[] = [];
  readRecordList(data, 'portfolio_individual').forEach((item, index) => {
    const row = asRecord(item);
    if (!row) return;
    const filePath = readString(row, 'file_path');
    const onlineLink = readString(row, 'online_link');
    const translation = pickTranslation(
      row,
      data,
      'portfolio_individual_translation'
    );
    const description = readString(translation, 'description');
    if (!filePath && !onlineLink && !description) return;
    items.push({
      id: String(row.id ?? `portfolio-${index}`),
      title: description || fileNameFromPath(filePath || onlineLink),
      description,
      imageSrc: filePath,
      href: onlineLink || filePath || undefined,
      fileName: fileNameFromPath(filePath || onlineLink),
      sizeLabel: readString(row, 'file_size') || readString(row, 'size') || '',
      updatedAt:
        readString(row, 'updated_at') || readString(row, 'modified_at') || '',
    });
  });
  return items;
}

export function applyIndividualPublicPanel(
  profile: PublicPanelProfile,
  individualData: ProfileRetrieveData | null | undefined
): PublicPanelProfile {
  if (!individualData) return profile;

  const identity = pickSection(individualData, 'identity_info_individual');
  const translation = pickTranslation(
    identity,
    individualData,
    'identity_info_individual_translation'
  );
  const contact = pickSection(individualData, 'contact_info_individual');
  const socialLinks = collectSocialLinks(contact);
  const otherInfo: OtherInfoContent = {
    resume: mapResume(individualData),
    portfolio: mapPortfolio(individualData),
    certificates: profile.otherInfo.certificates,
  };
  const fullName = readString(translation, 'full_name');

  return {
    ...profile,
    actorType: TARGET_TYPE.user,
    displayName: fullName || profile.displayName,
    providerBadgeKey: 'individualProvider',
    socialLinks: socialLinks.length > 0 ? socialLinks : profile.socialLinks,
    serviceSocialLinks:
      socialLinks.length > 0 ? socialLinks : profile.serviceSocialLinks,
    otherInfo,
  };
}

export function mapBusinessPublicPanel(
  actorId: number,
  publicData: ProfileRetrieveData | null | undefined
): PublicPanelProfile {
  const identity = pickSection(publicData, 'identity_info_business');
  const translation = pickTranslation(
    identity,
    publicData,
    'identity_info_business_translation'
  );
  const contact = pickSection(publicData, 'contact_info_business');
  const address = pickSection(publicData, 'address_business');
  const addressTranslation = pickTranslation(
    address,
    publicData,
    'address_business_translation'
  );
  const logo = pickSection(publicData, 'logo_business');
  const ourBusiness = pickSection(publicData, 'our_business');
  const socialLinks = collectSocialLinks(contact);
  const divisions = asArray(
    address?.address_division_code_business ??
      publicData?.address_division_code_business
  )
    .map((item) => asRecord(item))
    .filter((row): row is Record<string, unknown> => Boolean(row));
  const locationParts = [
    readString(address, 'country_code'),
    ...divisions.map(
      (row) => readString(row, 'other') || readString(row, 'normalized_code')
    ),
    readString(addressTranslation, 'postal_address'),
  ].filter(Boolean);

  return {
    ...EMPTY_PUBLIC_PANEL,
    actorId,
    actorType: TARGET_TYPE.business,
    displayName:
      readString(translation, 'name') || readString(ourBusiness, 'username'),
    username: readString(ourBusiness, 'username'),
    roleLabelKey: 'normal',
    providerBadgeKey: null,
    location: locationParts.join('، '),
    bio:
      readString(translation, 'short_description') ||
      readString(translation, 'slogan'),
    avatarSrc: readString(logo, 'file_path'),
    socialLinks,
    serviceSocialLinks: socialLinks,
  };
}

export function isIndividualServiceProvider(
  userData: ProfileRetrieveData | null | undefined
): boolean {
  const ourUser = pickSection(userData, 'our_user');
  return readString(ourUser, 'is_individual_service_provider') === 'true';
}

export function mapVisitorPublicPanel(
  actorId: number,
  kind: PublicPanelKind,
  userData?: ProfileRetrieveData | null,
  individualData?: ProfileRetrieveData | null,
  businessData?: ProfileRetrieveData | null
): PublicPanelProfile {
  if (kind === 'business') {
    return mapBusinessPublicPanel(actorId, businessData);
  }

  const profile = mapPublicPanelProfile(actorId, userData);
  if (kind === 'individual' || isIndividualServiceProvider(userData)) {
    return applyIndividualPublicPanel(profile, individualData);
  }
  return profile;
}
