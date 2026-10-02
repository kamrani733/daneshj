'use client';

import { Copy, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { AppDialog } from '@/components/ui/app-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SearchField } from '@/components/ui/search-field';
import { cn } from '@/lib/utils';
import type { PeopleListActions } from '@public-panel/capabilities';
import type { StatsPeopleKind, StatsPerson } from '@public-panel/types/stats';

/** Owner wording («شما») from the Figma dialogs; others name the panel owner. */
const TITLE_KEY: Record<StatsPeopleKind, { owner: string; other: string }> = {
  followers: { owner: 'followersTitle', other: 'followersTitleOther' },
  following: { owner: 'followingTitle', other: 'followingTitleOther' },
  likers: { owner: 'likersTitle', other: 'likersTitleOther' },
  liked: { owner: 'likedTitle', other: 'likedTitleOther' },
  dislikers: { owner: 'dislikersTitleOther', other: 'dislikersTitleOther' },
};

type StatsPeopleDialogProps = {
  kind: StatsPeopleKind | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  people?: StatsPerson[];
  loading?: boolean;
  /** Who is viewing — decides the row button (`none` = no button). */
  actions: PeopleListActions;
  /** Panel owner's username for non-owner titles. */
  username: string;
  onGuestAction?: () => void;
  onPersonAction?: (person: StatsPerson, nextFollowing?: boolean) => void;
};

/** Followers / following / likers / liked people list. */
export function StatsPeopleDialog({
  kind,
  open,
  onOpenChange,
  people = [],
  loading = false,
  actions,
  username,
  onGuestAction,
  onPersonAction,
}: StatsPeopleDialogProps) {
  const t = useTranslations('publicPanel');
  const tDialog = useTranslations('publicPanel.statsDialog');
  const [items, setItems] = useState(people);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setItems(people);
      setQuery('');
    }
  }, [open, people, kind]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (person) =>
        person.username.toLowerCase().includes(q) ||
        person.displayName.toLowerCase().includes(q),
    );
  }, [items, query]);

  if (!kind) return null;

  const buttonKind: ButtonKind | null =
    actions === 'none'
      ? null
      : actions === 'owner'
        ? kind === 'followers'
          ? 'remove'
          : kind === 'following'
            ? 'unfollow'
            : 'toggle'
        : 'toggle';
  const title = tDialog(
    actions === 'owner' ? TITLE_KEY[kind].owner : TITLE_KEY[kind].other,
    { username },
  );

  function handleAction(person: StatsPerson) {
    if (actions === 'guestMessage') {
      onGuestAction?.();
      return;
    }
    if (buttonKind === 'remove' || buttonKind === 'unfollow') {
      setItems((prev) => prev.filter((p) => p.id !== person.id));
      onPersonAction?.(person, false);
      return;
    }
    const nextFollowing = !person.isFollowing;
    setItems((prev) =>
      prev.map((p) =>
        p.id === person.id ? { ...p, isFollowing: nextFollowing } : p,
      ),
    );
    onPersonAction?.(person, nextFollowing);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="content"
      title={title}
      className={cn(
        'flex max-h-[85vh] max-w-[420px] flex-col gap-4 overflow-hidden p-4',
        'dark:bg-app-search-category sm:max-w-[480px]',
      )}
    >
      <h2 className="ps-10 text-start text-base font-bold leading-7 text-app-filter-ink">
        {title}
      </h2>

      <button
        type="button"
        aria-label={tDialog('close')}
        onClick={() => onOpenChange(false)}
        className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full text-app-filter-muted hover:bg-black/5 dark:text-app-filter-ink dark:hover:bg-white/5"
      >
        <X className="size-5" strokeWidth={1.75} />
      </button>

      <SearchField
        label={tDialog('searchPlaceholder')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={tDialog('searchPlaceholder')}
      />

      {loading ? (
        <p className="py-8 text-center text-sm font-medium text-neutral-600 dark:text-app-filter-muted">
          {tDialog('loading')}
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm font-medium text-neutral-600 dark:text-app-filter-muted">
          {tDialog('emptySearch')}
        </p>
      ) : (
        <ul className="flex max-h-[min(60vh,480px)] flex-col gap-3 overflow-y-auto pe-1">
          {filtered.map((person) => (
            <li
              key={person.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl bg-app-stat-card p-3',
                'shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
              )}
            >
              <Avatar className="size-12 shrink-0 bg-border">
                {person.avatarSrc ? (
                  <AvatarImage
                    src={person.avatarSrc}
                    alt={person.displayName}
                  />
                ) : null}
                <AvatarFallback className="bg-border text-sm font-bold text-primary-foreground">
                  {person.displayName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-start">
                <span className="truncate text-sm font-bold text-app-filter-ink">
                  {person.username}
                </span>
                <span className="truncate text-xs font-medium text-neutral-600 dark:text-app-filter-muted">
                  {person.displayName}
                </span>
              </div>

              {buttonKind ? (
              <PeopleActionButton
                kind={buttonKind}
                person={person}
                labels={{
                  follow: t('follow'),
                  unfollow: t('unfollow'),
                  remove: t('remove'),
                }}
                onClick={() => handleAction(person)}
              />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </AppDialog>
  );
}

type ButtonKind = 'remove' | 'unfollow' | 'toggle';

function PeopleActionButton({
  kind,
  person,
  labels,
  onClick,
}: {
  kind: ButtonKind;
  person: StatsPerson;
  labels: { follow: string; unfollow: string; remove: string };
  onClick: () => void;
}) {
  if (kind === 'remove') {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        className="h-9 shrink-0 rounded-full border-destructive px-4 text-sm font-medium text-destructive shadow-none hover:bg-destructive/5 hover:text-destructive"
      >
        {labels.remove}
      </Button>
    );
  }

  if (kind === 'toggle') {
    const following = Boolean(person.isFollowing);
    return (
      <Button
        type="button"
        variant={following ? 'outline' : 'default'}
        onClick={onClick}
        className={cn(
          'h-9 shrink-0 rounded-full px-3 text-sm font-medium shadow-none',
          following
            ? 'border-border text-app-filter-ink hover:bg-black/5 dark:hover:bg-white/5'
            : 'bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90',
        )}
      >
        {following ? labels.unfollow : labels.follow}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="h-9 shrink-0 rounded-full border-border px-3 text-sm font-medium text-app-filter-ink shadow-none hover:bg-black/5 dark:hover:bg-white/5"
    >
      {labels.unfollow}
    </Button>
  );
}

type StatsShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  onShared?: (reason: string) => void;
};

/** Share-panel dialog opened from the share action. */
export function StatsShareDialog({
  open,
  onOpenChange,
  shareUrl,
  onShared,
}: StatsShareDialogProps) {
  const t = useTranslations('publicPanel.statsDialog');
  const [reason, setReason] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShared?.(reason.trim());
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setReason('');
          setCopied(false);
        }
        onOpenChange(next);
      }}
      variant="content"
      title={t('shareTitle')}
      className={cn(
        'flex max-w-[420px] flex-col gap-5',
        'dark:bg-app-search-category sm:max-w-[480px]',
      )}
    >
      <h2 className="text-start text-base font-bold text-app-filter-ink">
        {t('shareTitle')}
      </h2>

      <label className="relative block w-full">
        <span className="absolute -top-2.5 start-3 bg-app-search-fill px-1 text-xs font-medium text-primary dark:bg-app-search-category dark:text-primary-100">
          {t('shareReason')}
        </span>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('sharePlaceholder')}
          rows={3}
          className={cn(
            'w-full resize-none rounded-xl border border-app-filter-muted bg-transparent px-3 py-3',
            'text-start text-sm text-app-filter-ink placeholder:text-neutral-600',
            'dark:border-border dark:placeholder:text-app-filter-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          )}
        />
      </label>

      <div className="flex items-center gap-2 text-start">
        <button
          type="button"
          aria-label={t('copyLink')}
          onClick={() => void handleCopy()}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-app-filter-muted hover:bg-black/5 dark:text-app-filter-ink dark:hover:bg-white/5"
        >
          <Copy className="size-5" strokeWidth={1.5} />
        </button>
        <p
          className="min-w-0 flex-1 truncate text-sm text-app-filter-muted"
          dir="ltr"
        >
          {copied ? t('copied') : shareUrl}
        </p>
      </div>

      <div
        className="h-px w-full bg-app-carousel-inactive dark:bg-border"
        aria-hidden
      />

      <ul className="mx-auto grid grid-cols-4 gap-4">
        {SHARE_TARGETS.map((target) => (
          <li key={target.id} className="flex justify-center">
            <button
              type="button"
              aria-label={target.id}
              onClick={() => {
                onShared?.(reason.trim());
                if (typeof window !== 'undefined') {
                  window.open(
                    target.href(shareUrl, reason),
                    '_blank',
                    'noopener,noreferrer',
                  );
                }
              }}
              className={cn(
                'inline-flex size-12 items-center justify-center rounded-full text-white',
                target.className,
              )}
            >
              {target.icon}
            </button>
          </li>
        ))}
      </ul>
    </AppDialog>
  );
}

const SHARE_TARGETS = [
  {
    id: 'whatsapp',
    className: 'bg-[#25D366]',
    href: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent([text, url].filter(Boolean).join('\n'))}`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2.2A9.7 9.7 0 0 0 2.5 11.8c0 1.7.5 3.3 1.3 4.7L2.2 22l5.6-1.5a9.7 9.7 0 0 0 14.1-8.7A9.7 9.7 0 0 0 12 2.2Z" />
      </svg>
    ),
  },
  {
    id: 'telegram',
    className: 'bg-[#2AABEE]',
    href: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="currentColor"
        aria-hidden
      >
        <path d="M21.5 4.5 3.7 11.2c-1.2.5-1.2 1.7-.2 2.1l4.4 1.4 1.7 5.3c.3.9 1.2 1.1 1.8.4l2.5-2.7 4.7 3.5c.9.6 1.8.2 2.1-.8L22.8 5.8c.3-1.1-.6-2-1.3-1.3Z" />
      </svg>
    ),
  },
  {
    id: 'repost',
    className: 'bg-info',
    href: (url: string) => url,
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <path
          d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'instagram',
    className:
      'bg-[linear-gradient(45deg,#F58529_0%,#DD2A7B_50%,#8134AF_100%)]',
    href: (url: string) => url,
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    className: 'bg-[#1877F2]',
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <span className="text-xl font-bold leading-none" aria-hidden>
        f
      </span>
    ),
  },
  {
    id: 'drive',
    className:
      'bg-app-stat-card text-app-filter-muted ring-1 ring-app-carousel-inactive dark:text-app-filter-ink dark:ring-border',
    href: (url: string) => url,
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path fill="#4285F4" d="M8.5 3.5h7L22 14.5h-7L8.5 3.5Z" />
        <path fill="#34A853" d="M2 14.5 8.5 3.5 12 9.5 5.5 20.5 2 14.5Z" />
        <path fill="#FBBC04" d="M5.5 20.5H19l3-6H8.5l-3 6Z" />
      </svg>
    ),
  },
] as const;
