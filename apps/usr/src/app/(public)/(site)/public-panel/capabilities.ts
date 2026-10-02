import type { PublicPanelProfile } from '@public-panel/types/ui';

export type PublicPanelViewerRole = 'owner' | 'user' | 'guest' | 'admin';

/**
 * Access codes from the Expectation (User) report, Appendix 1:
 * F → `enabled` · M (guest) → `guestMessage` (shown; click → message m21) ·
 * V → `readonly` (counts only) · AR / NA → `hidden`.
 */
export type ActionAccess = 'enabled' | 'guestMessage' | 'readonly' | 'hidden';

export type CommentComposerMode = 'composer' | 'guestPrompt' | 'hidden';

/** Row action inside the followers / following / likers / liked dialogs. */
export type PeopleListActions = 'owner' | 'visitor' | 'guestMessage' | 'none';

export type PublicPanelCapabilities = {
  viewerRole: PublicPanelViewerRole;
  isPanelOwner: boolean;
  /** Signed-in non-owner, non-admin: allowed to call Interactive Ops. */
  canInteractWithPanel: boolean;
  /** UsrPb_IntrOp — follow / like / dislike / share. */
  engagementActions: ActionAccess;
  /** UsrPb_DspIntr — dislike count and list are admin-only. */
  showDislikes: boolean;
  peopleListActions: PeopleListActions;
  /** UsrPb_MySRV — only on an individual service provider panel. */
  showServiceInfoSection: boolean;
  /** UsrPb_SmtCmt */
  commentComposerMode: CommentComposerMode;
  /** UsrPb_LkDlkCmt */
  commentReactions: ActionAccess;
  /** UsrPb_RplCmt */
  commentReply: ActionAccess;
  /** UsrPb_TrfCmt */
  commentTransfer: ActionAccess;
  /** UsrPb_RptCmt */
  commentReport: ActionAccess;
  /** UsrPb_FavCmt */
  commentFeature: boolean;
  /** UsrPb_RmvCmt — own comments/replies; level-0 admin deletes any. */
  commentDeleteOwn: boolean;
  commentDeleteAny: boolean;
  /** UsrPb_RstCmt */
  commentRestore: boolean;
  /** UsrPb_RmvTrfCmt — owner removes / edits transferred comments. */
  manageTransferredComments: boolean;
};

type CapabilityInput = {
  profile: Pick<PublicPanelProfile, 'actorId' | 'providerBadgeKey'>;
  viewerActorId?: number | null;
  accessToken?: string | null;
  viewerIsAdmin?: boolean;
};

export function resolvePublicPanelViewerRole({
  profile,
  viewerActorId,
  accessToken,
  viewerIsAdmin,
}: CapabilityInput): PublicPanelViewerRole {
  const signedIn =
    viewerActorId != null && viewerActorId > 0 && Boolean(accessToken);
  if (!signedIn) return 'guest';
  if (viewerIsAdmin) return 'admin';
  if (viewerActorId === profile.actorId) return 'owner';
  return 'user';
}

const BY_ROLE: Record<
  PublicPanelViewerRole,
  Omit<
    PublicPanelCapabilities,
    'viewerRole' | 'isPanelOwner' | 'showServiceInfoSection'
  >
> = {
  owner: {
    canInteractWithPanel: false,
    engagementActions: 'hidden',
    showDislikes: false,
    peopleListActions: 'owner',
    commentComposerMode: 'hidden',
    commentReactions: 'enabled',
    commentReply: 'enabled',
    commentTransfer: 'hidden',
    commentReport: 'enabled',
    commentFeature: true,
    commentDeleteOwn: true,
    commentDeleteAny: false,
    commentRestore: false,
    manageTransferredComments: true,
  },
  user: {
    canInteractWithPanel: true,
    engagementActions: 'enabled',
    showDislikes: false,
    peopleListActions: 'visitor',
    commentComposerMode: 'composer',
    commentReactions: 'enabled',
    commentReply: 'enabled',
    commentTransfer: 'enabled',
    commentReport: 'enabled',
    commentFeature: false,
    commentDeleteOwn: true,
    commentDeleteAny: false,
    commentRestore: false,
    manageTransferredComments: false,
  },
  guest: {
    canInteractWithPanel: false,
    engagementActions: 'guestMessage',
    showDislikes: false,
    peopleListActions: 'guestMessage',
    commentComposerMode: 'guestPrompt',
    commentReactions: 'guestMessage',
    commentReply: 'guestMessage',
    commentTransfer: 'guestMessage',
    commentReport: 'guestMessage',
    commentFeature: false,
    commentDeleteOwn: false,
    commentDeleteAny: false,
    commentRestore: false,
    manageTransferredComments: false,
  },
  admin: {
    canInteractWithPanel: false,
    engagementActions: 'hidden',
    showDislikes: true,
    peopleListActions: 'none',
    commentComposerMode: 'hidden',
    commentReactions: 'readonly',
    commentReply: 'hidden',
    commentTransfer: 'hidden',
    commentReport: 'enabled',
    commentFeature: false,
    commentDeleteOwn: false,
    commentDeleteAny: true,
    commentRestore: true,
    manageTransferredComments: false,
  },
};

/**
 * Single source for section visibility and actions per viewer role × panel type.
 * Source: Expectation (User) «نقش عملگرها در صفحه پنل عمومی» and «عملیات دیدگاه ها».
 * Sections consume this object — no persona or role checks inside section components.
 */
export function getPublicPanelCapabilities(
  input: CapabilityInput
): PublicPanelCapabilities {
  const viewerRole = resolvePublicPanelViewerRole(input);
  return {
    viewerRole,
    isPanelOwner: viewerRole === 'owner',
    showServiceInfoSection: Boolean(input.profile.providerBadgeKey),
    ...BY_ROLE[viewerRole],
  };
}

/** Action is rendered (enabled, view-only, or guest message). */
export function isActionVisible(access: ActionAccess): boolean {
  return access !== 'hidden';
}
