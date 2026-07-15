/** Figma Main Banner artboard — #678:5121 (1312×480). */
export const HERO_ARTBOARD = { width: 1312, height: 480 } as const;

export type HeroTextAlign = 'end' | 'start' | 'center';

export type HeroRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type HeroSlideConfig = {
  id: string;
  imageSrc: string;
  /** Image rectangle in artboard coords (may overflow). */
  image: HeroRect;
  /** Copy column in artboard coords. */
  text: {
    x: number;
    y: number;
    w: number;
    gap: number;
    align: HeroTextAlign;
  };
  /** Desktop type scale matching Figma text styles. */
  type: {
    brand: string;
    tagline: string;
    description: string;
  };
  keys: {
    brand: string;
    tagline: string;
    description: string;
  };
};

/**
 * Slide geometry from Figma Main Banner variants:
 * - #678:5122 / #678:5132 / #678:5142
 */
export const HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: '1',
    imageSrc: '/images/home/hero-bg-1.png',
    image: { x: -79, y: -416, w: 1312, h: 1312 },
    text: { x: 876, y: 130, w: 372, gap: 48, align: 'end' },
    type: {
      brand: 'min-[834px]:text-[28px] min-[834px]:leading-10 min-[834px]:tracking-normal',
      tagline: 'min-[834px]:text-[28px] min-[834px]:leading-7',
      description: 'min-[834px]:text-xl min-[834px]:leading-7',
    },
    keys: {
      brand: 'slide1.brand',
      tagline: 'slide1.tagline',
      description: 'slide1.description',
    },
  },
  {
    id: '2',
    imageSrc: '/images/home/hero-bg-2.png',
    image: { x: 1, y: -416, w: 1312, h: 1312 },
    text: { x: 81, y: 130, w: 400, gap: 48, align: 'start' },
    type: {
      brand: 'min-[834px]:text-[28px] min-[834px]:leading-10 min-[834px]:tracking-normal',
      tagline: 'min-[834px]:text-[28px] min-[834px]:leading-7',
      description: 'min-[834px]:text-[22px] min-[834px]:leading-7',
    },
    keys: {
      brand: 'slide2.brand',
      tagline: 'slide2.tagline',
      description: 'slide2.description',
    },
  },
  {
    id: '3',
    imageSrc: '/images/home/hero-bg-3.png',
    image: { x: -148, y: -1128, w: 1608, h: 1608 },
    text: { x: 398, y: 261, w: 516, gap: 40, align: 'center' },
    type: {
      brand: 'min-[834px]:text-[22px] min-[834px]:leading-7 min-[834px]:tracking-normal',
      tagline: 'min-[834px]:text-[32px] min-[834px]:leading-7',
      description: 'min-[834px]:text-[22px] min-[834px]:leading-7',
    },
    keys: {
      brand: 'slide3.brand',
      tagline: 'slide3.tagline',
      description: 'slide3.description',
    },
  },
];

/** Convert artboard px → % for fluid layout. */
export function artboardStyle(rect: Pick<HeroRect, 'x' | 'y' | 'w' | 'h'>) {
  const { width: aw, height: ah } = HERO_ARTBOARD;
  return {
    left: `${(rect.x / aw) * 100}%`,
    top: `${(rect.y / ah) * 100}%`,
    width: `${(rect.w / aw) * 100}%`,
    height: `${(rect.h / ah) * 100}%`,
  } as const;
}
