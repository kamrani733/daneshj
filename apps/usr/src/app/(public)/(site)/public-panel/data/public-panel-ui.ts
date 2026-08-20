/** Public-panel paths and default data. */

import type { PublicPanelProfile } from '@public-panel/types/ui';

export type * from '@public-panel/types/ui';

export const PUBLIC_PANEL_PATH = '/public-panel';
export const COMMENT_MAX_LENGTH = 1000;

export const EMPTY_PUBLIC_PANEL: PublicPanelProfile = {
  actorId: 0,
  actorType: 1,
  displayName: '',
  username: '',
  roleLabelKey: 'normal',
  providerBadgeKey: null,
  location: '',
  bio: '',
  avatarSrc: '',
  electronicCardHref: '#',
  socialLinks: [],
  serviceSocialLinks: [],
  stats: {
    followers: 0,
    following: 0,
    likers: 0,
    liked: 0,
  },
  engagement: {
    thumbsUp: 0,
    thumbsDown: 0,
    shares: 0,
  },
  academicRecords: [],
  educationAddress: {
    country: '',
    province: '',
    city: '',
    district: '',
  },
  serviceCatalog: {
    totals: { discounts: 0, news: 0, newsletters: 0 },
    discounts: [],
    news: [],
    newsletters: [],
  },
  otherInfo: {
    resume: null,
    portfolio: [],
    certificates: [],
  },
  comments: [],
};
