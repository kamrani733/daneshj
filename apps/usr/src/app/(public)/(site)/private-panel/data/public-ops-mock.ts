/** Mock public-panel operations until Actor MS is wired. */

export type PublicPanelRestriction = {
  id: string;
  titleKey: 'one' | 'two';
  period: string;
  scope: string;
  reason: string;
};

/** Flip to `false` to preview the create-panel state. */
export const MOCK_HAS_PUBLIC_PANEL = true;

export const MOCK_PUBLIC_PANEL_RESTRICTIONS: PublicPanelRestriction[] = [
  {
    id: 'restriction-1',
    titleKey: 'one',
    period: '۱۴۰۴/۱۲/۰۵ تا ۱۴۰۵/۰۲/۰۵',
    scope: 'حوزه محدودی یک',
    reason: 'در این قسمت دلیل محدودی برای رفع ابهام کاربر شرح داده می‌شود',
  },
  {
    id: 'restriction-2',
    titleKey: 'two',
    period: '۱۴۰۴/۱۲/۰۵ تا ۱۴۰۵/۰۲/۰۵',
    scope: 'حوزه محدودی یک',
    reason: 'در این قسمت دلیل محدودی برای رفع ابهام کاربر شرح داده می‌شود',
  },
];
