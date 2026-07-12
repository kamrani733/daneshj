import Image from 'next/image';

import { HOME_IMAGES } from '../home-assets';

/** Figma BG Pattern #1:8924 — 1512×756, opacity 40%. */
export function HomeBgPattern() {
  return (
    <div
      aria-hidden
      className="home-bg-pattern pointer-events-none absolute inset-x-0 top-[88px] z-0 hidden h-[756px] min-[834px]:block"
    >
      <Image
        src={HOME_IMAGES.bgPattern}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-top"
        priority={false}
      />
    </div>
  );
}
