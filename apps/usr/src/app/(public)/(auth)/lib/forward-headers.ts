type HeaderSource = {
  get(name: string): string | null;
};

/** `X-Forwarded-For` from the incoming request, otherwise `x-real-ip`, plus `User-Agent`. */
export function pickForwardHeaders(incoming: HeaderSource): Record<string, string> {
  const forwardedFor = incoming.get('x-forwarded-for') ?? incoming.get('x-real-ip');
  const userAgent = incoming.get('user-agent');
  const headers: Record<string, string> = {};
  if (forwardedFor) headers['X-Forwarded-For'] = forwardedFor;
  if (userAgent) headers['User-Agent'] = userAgent;
  return headers;
}
