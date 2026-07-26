/**
 * Public route group root.
 * Site chrome (header/footer) lives in `(site)/layout`.
 * Auth flows use `(auth)/layout` without that chrome.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
