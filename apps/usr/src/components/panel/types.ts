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

export type PanelRoleLabelKey = 'normal' | 'student' | 'graduate';

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

export type PanelAcademicRecordStatus = 'verified' | 'declared';
export type PanelAcademicRecordRole = 'graduate' | 'student';

export type PanelEducationAddress = {
  country: string;
  province: string;
  city: string;
  district: string;
};

export type PanelAcademicRecord = {
  id: string;
  degree: string;
  university: string;
  fieldGroup?: string;
  description?: string;
  endDate?: string;
  role: PanelAcademicRecordRole;
  roleLabel?: string;
  status: PanelAcademicRecordStatus;
  statusLabel?: string;
};
