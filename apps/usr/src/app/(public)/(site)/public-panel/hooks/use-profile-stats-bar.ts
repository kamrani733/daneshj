'use client';

import { useEffect, useState } from 'react';

import {
  ACTOR_TYPE,
  LIKE_STATUS,
  SHARE_PLATFORM,
  TARGET_TYPE,
  useFollowMutation,
  useLikeMutation,
  usePanelInteractiveStatsQuery,
  useShareMutation,
} from '@public-panel/api';
import type { PublicPanelCapabilities } from '@public-panel/capabilities';
import type { PublicPanelProfile } from '@public-panel/types/ui';
import type { StatsPeopleKind, StatsPerson } from '@public-panel/types/stats';

type UseProfileStatsBarPayload = {
  profile: PublicPanelProfile;
  accessToken?: string | null;
  viewerActorId?: number | null;
  capabilities: PublicPanelCapabilities;
};

export function useProfileStatsBar({
  profile,
  accessToken,
  viewerActorId,
  capabilities,
}: UseProfileStatsBarPayload) {
  const [following, setFollowing] = useState(false);
  const [reaction, setReaction] = useState<'like' | 'dislike' | 'none'>(
    'none',
  );
  const [shares, setShares] = useState(profile.engagement.shares);
  const [peopleKind, setPeopleKind] = useState<StatsPeopleKind | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState(
    'https://www.daneshjooam.com/publicpanel/name&surname',
  );

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const { stats, people, isLoading } = usePanelInteractiveStatsQuery(
    {
      accessToken,
      targetId: profile.actorId,
      targetType: profile.actorType,
      actorType: profile.actorType,
    },
    true,
    {
      followers: profile.stats.followers,
      following: profile.stats.following,
      likers: profile.stats.likers,
      liked: profile.stats.liked,
      thumbsUp: profile.engagement.thumbsUp,
      thumbsDown: profile.engagement.thumbsDown,
    },
  );

  const followMutation = useFollowMutation();
  const likeMutation = useLikeMutation();
  const shareMutation = useShareMutation();

  const isOwnProfile = capabilities.isPanelOwner;
  const showActions = capabilities.showVisitorEngagementActions;
  const canInteract = capabilities.canInteractWithPanel;

  const displayStats = {
    followers: stats.followers,
    following: stats.following,
    likers: stats.likers,
    liked: stats.liked,
  };

  async function handleFollow() {
    const next = !following;
    setFollowing(next);
    if (!canInteract || !viewerActorId || !accessToken) return;
    try {
      const result = await followMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: profile.actorType,
        targetId: profile.actorId,
        isActive: next,
      });
      setFollowing(result.isActive);
    } catch {
      setFollowing(!next);
    }
  }

  async function handleReaction(next: 'like' | 'dislike') {
    const likeStatus =
      reaction === next
        ? LIKE_STATUS.none
        : next === 'like'
          ? LIKE_STATUS.like
          : LIKE_STATUS.dislike;
    const previous = reaction;
    setReaction(
      likeStatus === LIKE_STATUS.none
        ? 'none'
        : likeStatus === LIKE_STATUS.like
          ? 'like'
          : 'dislike',
    );
    if (!canInteract || !viewerActorId || !accessToken) return;
    try {
      const result = await likeMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: profile.actorType,
        targetId: profile.actorId,
        likeStatus,
      });
      setReaction(
        result.status === LIKE_STATUS.like
          ? 'like'
          : result.status === LIKE_STATUS.dislike
            ? 'dislike'
            : 'none',
      );
    } catch {
      setReaction(previous);
    }
  }

  async function handleShareConfirm(reason?: string) {
    setShares((value) => value + 1);
    if (!canInteract || !viewerActorId || !accessToken) return;
    try {
      await shareMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: profile.actorType as typeof TARGET_TYPE.user,
        targetId: profile.actorId,
        platform: SHARE_PLATFORM.inSite,
        url: shareUrl,
        reason,
      });
    } catch {
      setShares((value) => Math.max(0, value - 1));
    }
  }

  async function handlePeopleAction(
    person: Pick<StatsPerson, 'actorId' | 'id' | 'isFollowing'>,
    nextFollowing?: boolean,
  ) {
    if (!accessToken || viewerActorId == null || viewerActorId <= 0) return;
    const targetId = person.actorId ?? Number(person.id);
    if (!Number.isFinite(targetId) || targetId <= 0) return;

    if (peopleKind === 'liked') {
      await likeMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: TARGET_TYPE.user,
        targetId,
        likeStatus: LIKE_STATUS.none,
      });
      return;
    }

    if (
      peopleKind === 'following' ||
      peopleKind === 'likers' ||
      peopleKind === 'followers'
    ) {
      const isActive =
        peopleKind === 'likers' ? Boolean(nextFollowing) : false;
      if (peopleKind === 'followers' && !isOwnProfile) return;
      await followMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: TARGET_TYPE.user,
        targetId,
        isActive,
      });
    }
  }

  return {
    displayStats,
    followMutation,
    following,
    handleFollow,
    handlePeopleAction,
    handleReaction,
    handleShareConfirm,
    isLoading,
    likeMutation,
    people,
    peopleKind,
    reaction,
    setPeopleKind,
    setShareOpen,
    shareMutation,
    shareOpen,
    shares,
    shareUrl,
    showActions,
    stats,
  };
}
