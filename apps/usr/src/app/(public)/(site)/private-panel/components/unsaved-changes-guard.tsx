'use client';

import { useTranslations } from 'next-intl';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { AppDialog } from '@/components/ui/app-dialog';

/**
 * Single confirm flow for leaving unsaved work: every panel registers its dirty
 * state here, and every tab switch / cancel routes through `guard`.
 */
type UnsavedSource = {
  isDirty: boolean;
  discard: () => void;
};

type UnsavedChangesContextValue = {
  register: (key: string, source: UnsavedSource) => void;
  unregister: (key: string) => void;
  guard: (action: () => void, scope?: string[]) => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(
  null
);

const NOOP = () => {
  // Intentional no-op: cancel confirms the discard and does not navigate.
};

function dirtyKeys(
  sources: Map<string, UnsavedSource>,
  scope?: string[]
): string[] {
  return [...sources.entries()]
    .filter(
      ([key, source]) =>
        source.isDirty && (!scope || scope.includes(key))
    )
    .map(([key]) => key);
}

function DiscardWarningIcon() {
  return (
    <span
      aria-hidden
      className="flex size-8 items-center justify-center rounded-full bg-error text-base font-bold leading-none text-white"
    >
      !
    </span>
  );
}

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('privatePanel.unsavedChanges');
  const sourcesRef = useRef(new Map<string, UnsavedSource>());
  const [hasDirty, setHasDirty] = useState(false);
  const [pending, setPending] = useState<{
    action: () => void;
    keys: string[];
  } | null>(null);

  const syncDirty = useCallback(() => {
    setHasDirty(dirtyKeys(sourcesRef.current).length > 0);
  }, []);

  const register = useCallback(
    (key: string, source: UnsavedSource) => {
      sourcesRef.current.set(key, source);
      syncDirty();
    },
    [syncDirty]
  );

  const unregister = useCallback(
    (key: string) => {
      sourcesRef.current.delete(key);
      syncDirty();
    },
    [syncDirty]
  );

  const guard = useCallback((action: () => void, scope?: string[]) => {
    const keys = dirtyKeys(sourcesRef.current, scope);
    if (keys.length === 0) {
      action();
      return;
    }
    setPending({ action, keys });
  }, []);

  function confirmDiscard() {
    if (!pending) return;
    for (const key of pending.keys) {
      sourcesRef.current.get(key)?.discard();
    }
    const { action } = pending;
    setPending(null);
    action();
  }

  useEffect(() => {
    if (!hasDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasDirty]);

  const value = useMemo(
    () => ({ register, unregister, guard }),
    [register, unregister, guard]
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <AppDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        variant="confirm"
        title={t('confirm')}
        icon={<DiscardWarningIcon />}
        actionsStyle="text"
        primaryAction={{
          label: t('yes'),
          tone: 'destructive',
          onClick: confirmDiscard,
        }}
        secondaryAction={{
          label: t('no'),
          tone: 'muted',
        }}
      />
    </UnsavedChangesContext.Provider>
  );
}

/** Publishes a panel's dirty state so tab switches and cancels can confirm. */
export function useRegisterUnsavedChanges(
  key: string,
  isDirty: boolean,
  discard: () => void
) {
  const context = useContext(UnsavedChangesContext);
  const discardRef = useRef(discard);
  discardRef.current = discard;

  useEffect(() => {
    if (!context) return;
    context.register(key, {
      isDirty,
      discard: () => discardRef.current(),
    });
    return () => context.unregister(key);
  }, [context, key, isDirty]);
}

/**
 * Runs `action` immediately when nothing is dirty, otherwise asks first and
 * discards the in-scope panels on confirm. Omit `scope` to cover every panel.
 */
export function useUnsavedChangesGuard() {
  const context = useContext(UnsavedChangesContext);
  return useCallback(
    (action: () => void, scope?: string[]) => {
      if (!context) {
        action();
        return;
      }
      context.guard(action, scope);
    },
    [context]
  );
}

/** Confirm-and-discard with no follow-up navigation (cancel buttons). */
export function useDiscardConfirm() {
  const guard = useUnsavedChangesGuard();
  return useCallback(
    (scope?: string[]) => guard(NOOP, scope),
    [guard]
  );
}

export const UNSAVED_SCOPE = {
  fields: 'fields',
  manageVisibility: 'manageVisibility',
} as const;
