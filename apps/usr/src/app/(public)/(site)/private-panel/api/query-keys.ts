export const privatePanelQueryKeys = {
  all: ['private-panel'] as const,
  profile: () => [...privatePanelQueryKeys.all, 'profile'] as const,
};
