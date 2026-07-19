'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Closes a surface on outside pointer / Escape.
 * Single responsibility: dismiss lifecycle only.
 */
export function useDismissible(
  open: boolean,
  onDismiss: () => void,
  refs: Array<RefObject<HTMLElement | null>>
) {
  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      const inside = refs.some((ref) => ref.current?.contains(target));
      if (!inside) onDismiss();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleEscape);
    };
    // refs is read on each event; callers pass stable ref objects
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs identity is stable
  }, [open, onDismiss]);
}
