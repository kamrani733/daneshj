import type { CSSProperties } from 'react';

/** Figma Authentication frame 1794:11135 / EL-08379678 — 1512×982. */
export const FIGMA_FRAME = { width: 1512, height: 982 } as const;

/** Login Box EL-85c2cdda — flush left, rounded on the end edge only. */
export const FIGMA_LOGIN_PANEL = {
  x: 0,
  y: 131,
  width: 630,
  height: 720,
  formWidth: 368,
  paddingX: 131,
} as const;

/** Mobile login card EL-4410458d. */
export const FIGMA_LOGIN_PANEL_MOBILE = {
  width: 363,
  minHeight: 635,
  radius: 28,
} as const;

/** Decorative card grid group 611:2733–611:2738 — 224px tiles on a 469×717 grid. */
export const FIGMA_CARD_GRID = {
  x: 831,
  y: 133,
  width: 469,
  height: 717,
  card: 224,
  gap: 21,
} as const;

export const CARD_COL_LEFT = [0, FIGMA_CARD_GRID.card + FIGMA_CARD_GRID.gap] as const;
export const CARD_ROW_TOP = [0, 248, 493] as const;

export type CardSlot = { col: number; row: number };

export function cardSlotStyle({ col, row }: CardSlot): CSSProperties {
  return {
    left: CARD_COL_LEFT[col],
    top: CARD_ROW_TOP[row],
  };
}

/** Full-frame scene backgrounds (1512×982). */
export const AUTH_SCENE_IMAGES = {
  light: '/images/register/bg-light.png',
  dark: '/images/register/bg-dark.png',
} as const;

export const MAZE_LINES = "url('/images/register/card-lines-green.svg')";
export const MAZE_LINES_BLUE = "url('/images/register/card-lines-blue.svg')";

type FormPatternLayer = {
  className: string;
  image: string;
  position: string;
};

export const FORM_PATTERN_LAYERS: readonly FormPatternLayer[] = [
  {
    className: '-start-[10%] -top-[35%] h-[130%] w-[130%]',
    image: MAZE_LINES,
    position: 'cover',
  },
  {
    className: '-bottom-[20%] -end-[5%] h-[55%] w-[110%]',
    image: MAZE_LINES_BLUE,
    position: 'bottom center',
  },
] as const;
