/** Shared public-panel types/paths (page UI + site menu). */

export type SocialNetwork =
  | 'email'
  | 'telegram'
  | 'instagram'
  | 'x'
  | 'whatsapp'
  | 'linkedin'
  | 'website';

export type PublicPanelSocialLink = {
  network: SocialNetwork;
  href: string;
};

export type AcademicRecord = {
  id: string;
  degree: string;
  field: string;
  university: string;
  years: string;
};

export type DiscountOffer = {
  id: string;
  title: string;
  businessName: string;
  imageSrc: string;
  postedAgo: string;
  rating: number;
  reviewCount: number;
  originalPrice: string;
  finalPrice: string;
  discountBadge: string;
};

export type NewsItem = {
  id: string;
  title: string;
  imageSrc: string;
  viewCount: number;
  scopeLabel: string;
  publisherType: string;
  publishedAt: string;
  mainCategory: string;
  subCategory: string;
  summary: string;
  eventRange: string;
};

export type NewsletterItem = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  publisherName: string;
  publisherInitial: string;
  publishedAt: string;
  rating: number;
  reviewCount: number;
};

export type ServiceCatalog = {
  /** Totals for section/tab badges (may exceed preview list length). */
  totals: {
    discounts: number;
    news: number;
    newsletters: number;
  };
  discounts: DiscountOffer[];
  news: NewsItem[];
  newsletters: NewsletterItem[];
};

export type CommentKind = 'transferred' | 'registered';

export type CommentSort = 'newest' | 'oldest' | 'mostLiked';

export type PanelComment = {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
  kind: CommentKind;
  featured?: boolean;
  likes: number;
  dislikes: number;
  shares: number;
  replyToName?: string;
  replies?: PanelComment[];
};

export type PublicPanelProfile = {
  /** Interactive Ops actor/target id for this panel owner. */
  actorId: number;
  /** Interactive Ops actor/target type (1 = user). */
  actorType: 1 | 2 | 3 | 4;
  displayName: string;
  username: string;
  roleLabelKey: 'student';
  providerBadgeKey: 'individualProvider';
  location: string;
  bio: string;
  avatarSrc: string;
  electronicCardHref: string;
  socialLinks: PublicPanelSocialLink[];
  serviceSocialLinks: PublicPanelSocialLink[];
  stats: {
    followers: number;
    following: number;
    likers: number;
    liked: number;
  };
  engagement: {
    thumbsUp: number;
    thumbsDown: number;
    shares: number;
  };
  academicRecords: AcademicRecord[];
  serviceCatalog: ServiceCatalog;
  otherInfo: string[];
  comments: PanelComment[];
};

export const PUBLIC_PANEL_PATH = '/public-panel';
export const COMMENT_MAX_LENGTH = 1000;
