export const authQueryKeys = {
  all: ['auth'] as const,
  sessions: (sessionKey: string) =>
    [...authQueryKeys.all, 'sessions', sessionKey] as const,
  sessionsForLimitReached: () =>
    [...authQueryKeys.all, 'sessions', 'limit-reached'] as const,
  securityQuestions: () =>
    [...authQueryKeys.all, 'security-questions'] as const,
};
