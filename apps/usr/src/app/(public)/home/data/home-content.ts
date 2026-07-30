export type DiscountItem = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
};

export type BusinessItem = {
  id: string;
  imageSrc: string;
};

export const DISCOUNT_ITEMS: DiscountItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `discount-${index + 1}`,
  title: 'home.discounts.cardTitle',
  subtitle: 'home.discounts.cardSubtitle',
  imageSrc: '/images/home/discount-card.png',
}));

export const BUSINESS_ITEMS: BusinessItem[] = Array.from({ length: 7 }, (_, index) => ({
  id: `business-${index + 1}`,
  imageSrc: '/images/home/discount-card.png',
}));
