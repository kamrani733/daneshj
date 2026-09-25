import { getPublicPanelCapabilities } from '@public-panel/capabilities';

const baseProfile = {
  actorId: 46,
  providerBadgeKey: 'individualProvider' as const,
};

describe('getPublicPanelCapabilities', () => {
  it('hides visitor engagement for panel owner', () => {
    const caps = getPublicPanelCapabilities({
      profile: baseProfile,
      viewerActorId: 46,
      accessToken: 'token',
    });
    expect(caps.isPanelOwner).toBe(true);
    expect(caps.showVisitorEngagementActions).toBe(false);
    expect(caps.commentComposerMode).toBe('hidden');
    expect(caps.showCommentOwnerActions).toBe(true);
  });

  it('shows composer and reactions for signed-in visitor', () => {
    const caps = getPublicPanelCapabilities({
      profile: baseProfile,
      viewerActorId: 99,
      accessToken: 'token',
    });
    expect(caps.showVisitorEngagementActions).toBe(true);
    expect(caps.commentComposerMode).toBe('composer');
    expect(caps.showCommentVisitorReactions).toBe(true);
    expect(caps.showCommentOwnerActions).toBe(false);
  });

  it('guest gets prompt and no service actions', () => {
    const caps = getPublicPanelCapabilities({
      profile: baseProfile,
      viewerActorId: null,
      accessToken: null,
    });
    expect(caps.commentComposerMode).toBe('guestPrompt');
    expect(caps.canInteractWithPanel).toBe(false);
  });

  it('hides provider sections when badge absent', () => {
    const caps = getPublicPanelCapabilities({
      profile: { actorId: 46, providerBadgeKey: null },
      viewerActorId: 99,
      accessToken: 'token',
    });
    expect(caps.showServiceInfoSection).toBe(false);
  });
});
