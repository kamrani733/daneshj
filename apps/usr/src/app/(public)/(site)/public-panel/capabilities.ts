import type { PublicPanelProfile } from '@public-panel/types/ui';

export type CommentComposerMode = 'composer' | 'guestPrompt' | 'hidden';

export type PublicPanelCapabilities = {
  isPanelOwner: boolean;
  showVisitorEngagementActions: boolean;
  showServiceInfoSection: boolean;
  commentComposerMode: CommentComposerMode;
  showCommentOwnerActions: boolean;
  showCommentVisitorReactions: boolean;
  showCommentTransferAction: boolean;
  canInteractWithPanel: boolean;
  canInteractWithComments: boolean;
};

type CapabilityInput = {
  profile: Pick<PublicPanelProfile, 'actorId' | 'providerBadgeKey'>;
  viewerActorId?: number | null;
  accessToken?: string | null;
};

/**
 * Single source for section visibility and actions (visitor, owner, guest, provider vs user panel).
 * Sections consume this object — no persona checks inside section components.
 */
export function getPublicPanelCapabilities({
  profile,
  viewerActorId,
  accessToken,
}: CapabilityInput): PublicPanelCapabilities {
  const isPanelOwner =
    viewerActorId != null &&
    viewerActorId > 0 &&
    viewerActorId === profile.actorId;

  const isSignedInVisitor =
    !isPanelOwner &&
    viewerActorId != null &&
    viewerActorId > 0 &&
    Boolean(accessToken);

  const isGuestViewer = !isPanelOwner && !isSignedInVisitor;

  const showProviderPanel = Boolean(profile.providerBadgeKey);

  let commentComposerMode: CommentComposerMode = 'hidden';
  if (isGuestViewer) {
    commentComposerMode = 'guestPrompt';
  } else if (isSignedInVisitor) {
    commentComposerMode = 'composer';
  }

  return {
    isPanelOwner,
    showVisitorEngagementActions: !isPanelOwner,
    showServiceInfoSection: showProviderPanel,
    commentComposerMode,
    showCommentOwnerActions: isPanelOwner,
    showCommentVisitorReactions: isSignedInVisitor,
    showCommentTransferAction: isPanelOwner || isSignedInVisitor,
    canInteractWithPanel: isSignedInVisitor,
    canInteractWithComments: isSignedInVisitor,
  };
}
