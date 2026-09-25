import type { PanelSocialLink, SocialNetwork } from '@/components/panel/types';

/** Hero card — classic social handles only (matches mock + Figma hero). */
export const PANEL_HERO_SOCIAL_NETWORKS: readonly SocialNetwork[] = [
  'email',
  'telegram',
  'instagram',
  'x',
  'whatsapp',
  'linkedin',
] as const;

/** Service info grid — hero set plus Git, phones, and website (Figma `400:139510`). */
export const PANEL_SERVICE_SOCIAL_NETWORKS: readonly SocialNetwork[] = [
  ...PANEL_HERO_SOCIAL_NETWORKS,
  'github',
  'mobile',
  'phone',
  'website',
] as const;

/** Second row of service grid (Figma `400:139510`): four icons, centered. */
export const PANEL_SERVICE_SOCIAL_ROW_2: readonly SocialNetwork[] = [
  'github',
  'mobile',
  'phone',
  'website',
] as const;

export function partitionServiceSocialLinks(links: PanelSocialLink[]): {
  row1: PanelSocialLink[];
  row2: PanelSocialLink[];
} {
  const byNetwork = new Map(links.map((link) => [link.network, link]));
  const row1 = PANEL_HERO_SOCIAL_NETWORKS.flatMap((network) => {
    const link = byNetwork.get(network);
    return link ? [link] : [];
  });
  const row2 = PANEL_SERVICE_SOCIAL_ROW_2.flatMap((network) => {
    const link = byNetwork.get(network);
    return link ? [link] : [];
  });
  return { row1, row2 };
}

const CONTACT_FIELD: Record<SocialNetwork, string> = {
  email: 'email',
  telegram: 'telegram_id',
  instagram: 'instagram_id',
  x: 'twitter_id',
  whatsapp: 'whatsapp_id',
  linkedin: 'linkedin_id',
  github: 'git_link',
  mobile: 'mobile',
  phone: 'landline_phone',
  website: 'website',
};

export function panelSocialHref(
  network: SocialNetwork,
  value: string,
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
    case 'github':
      if (trimmed.startsWith('http')) return trimmed;
      return `https://github.com/${trimmed.replace(/^@/, '')}`;
    case 'mobile':
    case 'phone':
      return `tel:${trimmed.replace(/[^\d+]/g, '')}`;
    case 'website':
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    default:
      return null;
  }
}

export function collectPanelSocialLinks(
  contact: Record<string, unknown> | null,
  networks: readonly SocialNetwork[],
  readString: (obj: Record<string, unknown> | null, key: string) => string,
): PanelSocialLink[] {
  const links: PanelSocialLink[] = [];
  for (const network of networks) {
    const value = readString(contact, CONTACT_FIELD[network]);
    const href = panelSocialHref(network, value);
    if (href) links.push({ network, href });
  }
  return links;
}
