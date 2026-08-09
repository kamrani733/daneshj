/** Shared identity fields for public + private panels. */

export type SocialNetwork =
  | 'email'
  | 'telegram'
  | 'instagram'
  | 'x'
  | 'whatsapp'
  | 'linkedin'
  | 'website';

export type PanelSocialLink = {
  network: SocialNetwork;
  href: string;
};

export type PanelRoleLabelKey = 'student';

export type PanelProviderBadgeKey = 'individualProvider';

export type PanelProfileIdentity = {
  displayName: string;
  username: string;
  roleLabelKey: PanelRoleLabelKey;
  /** Omit / null when the owner is not a service provider. */
  providerBadgeKey?: PanelProviderBadgeKey | null;
  location: string;
  /** Empty string hides the about-me card. */
  bio: string;
  avatarSrc: string;
  electronicCardHref: string;
  socialLinks: PanelSocialLink[];
};
