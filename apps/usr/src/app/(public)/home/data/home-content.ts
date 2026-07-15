export type DiscountItem = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageSrc: string;
};

export type BusinessItem = {
  id: string;
  header: string;
  subhead: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
};

export const DISCOUNT_ITEMS: DiscountItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `discount-${index + 1}`,
  title: 'home.discounts.cardTitle',
  subtitle: 'home.discounts.cardSubtitle',
  badge: 'home.discounts.cardBadge',
  imageSrc: '/images/home/discount-card.png',
}));

export const BUSINESS_ITEMS: BusinessItem[] = Array.from({ length: 7 }, (_, index) => ({
  id: `business-${index + 1}`,
  header: 'home.businesses.cardHeader',
  subhead: 'home.businesses.cardSubhead',
  title: 'home.businesses.cardTitle',
  subtitle: 'home.businesses.cardSubtitle',
  description: 'home.businesses.cardDescription',
  imageSrc: '/images/home/discount-card.png',
}));

export const FOOTER_QUICK_LINKS = ['quickHome', 'quickCooperation', 'quickSupport'] as const;

export const FOOTER_LEGAL_LINKS = [
  'about',
  'terms',
  'privacy',
  'faq',
  'guide',
  'contact',
] as const;
