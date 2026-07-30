import Image from 'next/image';

import { SITE_IMAGES } from '@/components/site/site-assets';

/** Figma BG Pattern #1:8924 — 1512×756, opacity 40%. */
export function SiteBgPattern() {
  return (
    <div
      aria-hidden
      className="home-bg-pattern pointer-events-none absolute inset-x-0 top-12 z-0 hidden h-[756px] opacity-40 min-[834px]:block lg:top-[88px]"
    >
      <Image
        src={SITE_IMAGES.bgPattern}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-top"
        priority={false}
      />
    </div>
  );
}
