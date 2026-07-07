'use client';

import { useLayoutEffect, useState, type ReactNode } from 'react';

import {
  AUTH_SCENE_IMAGES,
  FIGMA_FRAME,
  FORM_PATTERN_LAYERS,
} from './auth-scene-assets';

function useBackgroundScale() {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    let frame = 0;

    const update = () => {
      setScale(
        Math.max(
          window.innerWidth / FIGMA_FRAME.width,
          window.innerHeight / FIGMA_FRAME.height
        )
      );
    };

    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return scale;
}

function FigmaScene({
  scale,
  children,
}: {
  scale: number;
  children: ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-auth-scene">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: FIGMA_FRAME.width,
          height: FIGMA_FRAME.height,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SceneBackground() {
  return (
    <>
      <img
        src={AUTH_SCENE_IMAGES.light}
        alt=""
        draggable={false}
        aria-hidden
        className="absolute inset-0 size-full dark:hidden"
      />
      <img
        src={AUTH_SCENE_IMAGES.dark}
        alt=""
        draggable={false}
        aria-hidden
        className="absolute inset-0 hidden size-full dark:block"
      />
    </>
  );
}

/** Full-page auth scene (shared by auth flows + landing). */
export function AuthPageBackground({ children }: { children?: ReactNode }) {
  const scale = useBackgroundScale();

  return (
    <FigmaScene scale={scale}>
      <SceneBackground />
      {children}
    </FigmaScene>
  );
}

/** Faint maze inside the login box panel. */
export function FormPattern() {
  return (
    <>
      {FORM_PATTERN_LAYERS.map((layer) => (
        <div
          key={layer.className}
          aria-hidden
          className={`auth-form-pattern pointer-events-none absolute z-0 ${layer.className}`}
          style={{
            backgroundImage: layer.image,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: layer.position === 'cover' ? undefined : layer.position,
          }}
        />
      ))}
    </>
  );
}
