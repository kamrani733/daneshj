/** Public-panel UI domain models. */

import type {
  PanelAcademicRecord,
  PanelEducationAddress,
  PanelProfileIdentity,
  PanelSocialLink,
  SocialNetwork,
} from '@/components/panel';

export type { PanelSocialLink as PublicPanelSocialLink, SocialNetwork };

export type AcademicRecordStatus = PanelAcademicRecord['status'];
export type AcademicRecordRole = PanelAcademicRecord['role'];
export type EducationAddress = PanelEducationAddress;
export type AcademicRecord = PanelAcademicRecord;

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
  publisherType: string;
  publishedAt: string;
  summary: string;
  rating: number;
  reviewCount: number;
  scopeLabel?: string;
  mainCategory?: string;
  subCategory?: string;
  eventRange?: string;
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
  viewCount: number;
  periodLabel: string;
};

export type ServiceCatalog = {
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

/** Figma «Sorting overlay»: date added (default) · likes · dislikes · replies. */
export type CommentSort = 'date' | 'likes' | 'dislikes' | 'replies';

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
  quoteNote?: string;
  originalAuthorName?: string;
  originalAuthorHandle?: string;
  statusLabel?: string;
  timeLabel?: string;
  /** Author's actor id — lets the viewer delete their own comment / reply. */
  authorActorId?: number;
  /** Soft-deleted; only admins still see it (and can restore it). */
  deleted?: boolean;
};

export type ResumeFile = {
  fileName: string;
  sizeLabel: string;
  updatedAt: string;
  href: string;
  previewHref?: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  href?: string;
  /** File card (Figma): name, size, last update. */
  fileName?: string;
  sizeLabel?: string;
  updatedAt?: string;
};

export type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  href?: string;
};

export type OtherInfoContent = {
  resume?: ResumeFile | null;
  portfolio: PortfolioItem[];
  certificates: CertificateItem[];
};

export type PublicPanelProfile = PanelProfileIdentity & {
  actorId: number;
  actorType: 1 | 2 | 3 | 4;
  serviceSocialLinks: PanelSocialLink[];
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
  educationAddress: EducationAddress;
  serviceCatalog: ServiceCatalog;
  otherInfo: OtherInfoContent;
  comments: PanelComment[];
};
