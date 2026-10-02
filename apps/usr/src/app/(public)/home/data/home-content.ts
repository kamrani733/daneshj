import type { DiscountCardData } from '@/components/cards';

export type HomeDiscountItem = DiscountCardData & { id: string };

export type BusinessItem = {
  id: string;
  title: string;
  imageSrc: string;
};

const PANEL_PHOTOS = '/images/public-panel/catalog';
const HOME_PHOTOS = '/images/home/photos';

/** Shared discount-card copy from the home Figma (all cards use the same placeholder text). */
const DISCOUNT_COPY = {
  title: 'نام محصول یا سرویس تخفیف دار',
  businessName: 'عنوان کسب و کار ارایه کننده تخفیف',
  postedAgo: 'دو ساعت پیش',
  originalPrice: '۱۲۰,۰۰۰ تومان',
  finalPrice: '۸۴,۰۰۰ تومان',
  rating: 4.5,
  reviewCount: 132,
} as const;

/**
 * Home «تخفیف‌ها» — 4×2 grid, order as in the home Figma (right → left).
 * Photos: Unsplash License — public-panel set (book stall, loungers, hotel room,
 * cosmetics) + home set: sweaters Markus Winkler, bookstore Philipp Hubert,
 * stationery Taylor Heery, books deepigoyal.
 */
export const DISCOUNT_ITEMS: HomeDiscountItem[] = [
  { id: 'd1', imageSrc: `${PANEL_PHOTOS}/book-stall.jpg`, discountBadge: '۲۴۰ هزار تومان', ...DISCOUNT_COPY },
  { id: 'd2', imageSrc: `${PANEL_PHOTOS}/pool-loungers.jpg`, discountBadge: '۳۰٪ تخفیف', ...DISCOUNT_COPY },
  { id: 'd3', imageSrc: `${PANEL_PHOTOS}/hotel-room.jpg`, discountBadge: '۳۰٪ تخفیف', ...DISCOUNT_COPY },
  { id: 'd4', imageSrc: `${PANEL_PHOTOS}/cosmetics.jpg`, discountBadge: '۳۰٪ تخفیف', ...DISCOUNT_COPY },
  { id: 'd5', imageSrc: `${HOME_PHOTOS}/home-books.jpg`, discountBadge: '۳۰٪ تخفیف', ...DISCOUNT_COPY },
  { id: 'd6', imageSrc: `${HOME_PHOTOS}/home-clothes.jpg`, discountBadge: '۳۰٪ تخفیف', ...DISCOUNT_COPY },
  { id: 'd7', imageSrc: `${HOME_PHOTOS}/home-bookstore.jpg`, discountBadge: '۲۴۰ هزار تومان', ...DISCOUNT_COPY },
  { id: 'd8', imageSrc: `${HOME_PHOTOS}/home-stationery.jpg`, discountBadge: '۳۰٪ تخفیف', ...DISCOUNT_COPY },
];

/**
 * Home «کسب و کار ها» carousel. Photos: Unsplash License — café Natali N, barber
 * Nathon Oski, gym Jinish Shah, flower café Anson Wilson, plant shop / open sign
 * Tim Mossholder.
 */
export const BUSINESS_ITEMS: BusinessItem[] = [
  { id: 'b1', title: 'کافه کتاب دانشجو', imageSrc: `${HOME_PHOTOS}/biz-cafe.jpg` },
  { id: 'b2', title: 'آرایشگاه مردانه نوین', imageSrc: `${HOME_PHOTOS}/biz-barber.jpg` },
  { id: 'b3', title: 'باشگاه ورزشی پویا', imageSrc: `${HOME_PHOTOS}/biz-gym.jpg` },
  { id: 'b4', title: 'گل و کافه بهار', imageSrc: `${HOME_PHOTOS}/biz-flower-cafe.jpg` },
  { id: 'b5', title: 'گلخانه سبز', imageSrc: `${HOME_PHOTOS}/biz-plant-shop.jpg` },
  { id: 'b6', title: 'فروشگاه محله', imageSrc: `${HOME_PHOTOS}/biz-open-sign.jpg` },
];
