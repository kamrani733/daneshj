import { getPublicPanelCapabilities } from '@public-panel/capabilities';

const providerPanel = {
  actorId: 46,
  providerBadgeKey: 'individualProvider' as const,
};

describe('getPublicPanelCapabilities', () => {
  it('owner: no engagement, owner list actions, feature + manage transferred', () => {
    const caps = getPublicPanelCapabilities({
      profile: providerPanel,
      viewerActorId: 46,
      accessToken: 'token',
    });
    expect(caps.viewerRole).toBe('owner');
    expect(caps.engagementActions).toBe('hidden');
    expect(caps.peopleListActions).toBe('owner');
    expect(caps.commentComposerMode).toBe('hidden');
    expect(caps.commentFeature).toBe(true);
    expect(caps.commentTransfer).toBe('hidden');
    expect(caps.manageTransferredComments).toBe(true);
  });

  it('signed-in user: full visitor access, no dislike count', () => {
    const caps = getPublicPanelCapabilities({
      profile: providerPanel,
      viewerActorId: 99,
      accessToken: 'token',
    });
    expect(caps.viewerRole).toBe('user');
    expect(caps.engagementActions).toBe('enabled');
    expect(caps.canInteractWithPanel).toBe(true);
    expect(caps.showDislikes).toBe(false);
    expect(caps.commentComposerMode).toBe('composer');
    expect(caps.commentReply).toBe('enabled');
    expect(caps.commentTransfer).toBe('enabled');
    expect(caps.commentFeature).toBe(false);
  });

  it('guest: actions shown with message m21, no API calls', () => {
    const caps = getPublicPanelCapabilities({
      profile: providerPanel,
      viewerActorId: null,
      accessToken: null,
    });
    expect(caps.viewerRole).toBe('guest');
    expect(caps.engagementActions).toBe('guestMessage');
    expect(caps.canInteractWithPanel).toBe(false);
    expect(caps.commentComposerMode).toBe('guestPrompt');
    expect(caps.commentReactions).toBe('guestMessage');
  });

  it('admin: no engagement, sees dislikes, deletes and restores any comment', () => {
    const caps = getPublicPanelCapabilities({
      profile: providerPanel,
      viewerActorId: 7,
      accessToken: 'token',
      viewerIsAdmin: true,
    });
    expect(caps.viewerRole).toBe('admin');
    expect(caps.engagementActions).toBe('hidden');
    expect(caps.showDislikes).toBe(true);
    expect(caps.commentComposerMode).toBe('hidden');
    expect(caps.commentReactions).toBe('readonly');
    expect(caps.commentDeleteAny).toBe(true);
    expect(caps.commentRestore).toBe(true);
    expect(caps.commentTransfer).toBe('hidden');
  });

  it('hides provider sections on a non-provider panel', () => {
    const caps = getPublicPanelCapabilities({
      profile: { actorId: 46, providerBadgeKey: null },
      viewerActorId: 99,
      accessToken: 'token',
    });
    expect(caps.showServiceInfoSection).toBe(false);
  });
});
