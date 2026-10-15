/** Internal paths only — data never sends the viewer to another origin. */
export function safeInternalHref(value: unknown): string | null {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null;
}
