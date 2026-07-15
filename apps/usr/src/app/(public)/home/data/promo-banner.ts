/** Figma Temp Banner #31:8259 — colored surface 1312×300, frame w/ dots 1312×342. */
export const PROMO_SURFACE = { width: 1312, height: 300 } as const;
export const PROMO_FRAME = { width: 1312, height: 342 } as const;

export type PromoTone = 'primary' | 'invite' | 'reward';

export type PromoRect = { x: number; y: number; w: number; h: number };

export type PromoSlideConfig = {
  id: string;
  tone: PromoTone;
  bodyKey: string;
  ctaKey: string;
  href: string;
  decorSrc: string;
  /** Illustration Group in surface coords. */
  decor: PromoRect;
  /** Body copy box in surface coords. */
  text: PromoRect;
  /** Split button origin in surface coords. */
  button: { x: number; y: number };
  /** Side nav tint (Figma arrow fills). */
  arrowTint: string;
};

/**
 * Desktop geometry from Temp Banner variants:
 * #31:8260 (Banner1) · #31:8452 (Banner2) · #31:8660 (Banner3)
 */
export const PROMO_SLIDES: PromoSlideConfig[] = [
  {
    id: '1',
    tone: 'primary',
    bodyKey: 'promo.slide1.body',
    ctaKey: 'promo.cta',
    href: '/services',
    decorSrc: '/images/home/promo-decor-1.svg',
    decor: { x: 0, y: -95, w: 570, h: 395 },
    text: { x: 577, y: 36, w: 612, h: 156 },
    button: { x: 577, y: 216 },
    arrowTint: 'bg-[rgba(169,242,205,0.3)]',
  },
  {
    id: '2',
    tone: 'invite',
    bodyKey: 'promo.slide2.body',
    ctaKey: 'promo.cta',
    href: '/invite',
    decorSrc: '/images/home/promo-decor-2.svg',
    decor: { x: 99, y: -100, w: 360, h: 400 },
    text: { x: 577, y: 63, w: 671, h: 104 },
    button: { x: 577, y: 199 },
    arrowTint: 'bg-[rgba(193,233,251,0.3)]',
  },
  {
    id: '3',
    tone: 'reward',
    bodyKey: 'promo.slide3.body',
    ctaKey: 'promo.cta',
    href: '/rewards',
    decorSrc: '/images/home/promo-decor-3.svg',
    decor: { x: 0, y: -116, w: 570, h: 419 },
    text: { x: 577, y: 70, w: 671, h: 104 },
    button: { x: 577, y: 182 },
    arrowTint: 'bg-[rgba(255,219,207,0.3)]',
  },
];

export const PROMO_TONE_CLASS: Record<
  PromoTone,
  { surface: string; text: string; action: string }
> = {
  primary: {
    surface: 'bg-home-promo-primary',
    text: 'text-home-promo-primary',
    action: 'bg-home-promo-primary-action',
  },
  invite: {
    surface: 'bg-home-promo-invite',
    text: 'text-home-promo-invite',
    action: 'bg-home-promo-invite-action',
  },
  reward: {
    surface: 'bg-home-promo-reward',
    text: 'text-home-promo-reward',
    action: 'bg-home-promo-reward-action',
  },
};

/** Mobile cards — Figma #1:10553–10849 */
export const PROMO_MOBILE = {
  card: { w: 361, h: 405 },
  text: { w: 313 },
  decorOpacity: 0.6,
  decorByTone: {
    primary: { x: 8, y: 144, w: 346, h: 250 },
    invite: { x: 37, y: 73, w: 286, h: 332 },
    reward: { x: 0, y: 117, w: 377, h: 277 },
  } satisfies Record<PromoTone, PromoRect>,
} as const;

export function surfaceStyle(rect: PromoRect) {
  const { width: aw, height: ah } = PROMO_SURFACE;
  return {
    left: `${(rect.x / aw) * 100}%`,
    top: `${(rect.y / ah) * 100}%`,
    width: `${(rect.w / aw) * 100}%`,
    height: `${(rect.h / ah) * 100}%`,
  } as const;
}

export function surfacePoint(x: number, y: number) {
  const { width: aw, height: ah } = PROMO_SURFACE;
  return {
    left: `${(x / aw) * 100}%`,
    top: `${(y / ah) * 100}%`,
  } as const;
}
