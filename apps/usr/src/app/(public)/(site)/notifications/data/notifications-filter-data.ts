/** Notifications list filter — Figma Notification filter toolbar panel. */

export type NotificationFilterStatus = 'read' | 'unread';

export type NotificationsFilterValues = {
  sentStart: string;
  sentEnd: string;
  readStart: string;
  readEnd: string;
  /** Empty = no status filter; both = no filter */
  statuses: NotificationFilterStatus[];
  /** Selected category option ids (leaf and/or parent). */
  categoryIds: string[];
};

export const EMPTY_NOTIFICATION_FILTERS: NotificationsFilterValues = {
  sentStart: '',
  sentEnd: '',
  readStart: '',
  readEnd: '',
  statuses: [],
  categoryIds: [],
};

export type FilterCategoryOption = {
  id: string;
  /** Numeric id for API main/sub category when known */
  apiId?: number;
  labelKey: string;
  children?: FilterCategoryOption[];
};

/**
 * Hierarchical category options for the filter tree.
 * labelKey → notifications.filter.categories.*
 */
export const FILTER_CATEGORY_TREE: FilterCategoryOption[] = [
  {
    id: 'account',
    labelKey: 'account',
    children: [
      { id: 'account-block', apiId: 102, labelKey: 'accountBlock' },
      { id: 'account-limit', apiId: 103, labelKey: 'accountLimit' },
    ],
  },
  {
    id: 'comments',
    labelKey: 'comments',
    children: [
      { id: 'comments-moderate', apiId: 201, labelKey: 'commentsModerate' },
      { id: 'comments-reply', labelKey: 'commentsReply' },
      { id: 'comments-like', labelKey: 'commentsLike' },
      { id: 'comments-edit', labelKey: 'commentsEdit' },
    ],
  },
  {
    id: 'ticket',
    labelKey: 'ticket',
    children: [
      { id: 'ticket-operator', apiId: 211, labelKey: 'ticketOperator' },
      { id: 'ticket-leader', apiId: 212, labelKey: 'ticketLeader' },
    ],
  },
  {
    id: 'financial',
    labelKey: 'financial',
    children: [
      { id: 'financial-wallet', apiId: 261, labelKey: 'financialWallet' },
      { id: 'financial-plan', labelKey: 'financialPlan' },
      { id: 'financial-buy', labelKey: 'financialBuy' },
      { id: 'financial-renew', labelKey: 'financialRenew' },
    ],
  },
  {
    id: 'discount',
    labelKey: 'discount',
    children: [
      { id: 'discount-define', apiId: 302, labelKey: 'discountDefine' },
      { id: 'discount-approve', labelKey: 'discountApprove' },
      { id: 'discount-code', labelKey: 'discountCode' },
      { id: 'discount-receipt', labelKey: 'discountReceipt' },
      { id: 'discount-limit', labelKey: 'discountLimit' },
      { id: 'discount-expire', labelKey: 'discountExpire' },
    ],
  },
  {
    id: 'reward',
    labelKey: 'reward',
    children: [
      { id: 'reward-wallet', apiId: 311, labelKey: 'rewardWallet' },
      { id: 'reward-use', labelKey: 'rewardUse' },
      { id: 'reward-cash', labelKey: 'rewardCash' },
    ],
  },
  {
    id: 'news',
    labelKey: 'news',
    children: [
      { id: 'news-approve', apiId: 322, labelKey: 'newsApprove' },
    ],
  },
  {
    id: 'newsletter',
    labelKey: 'newsletter',
    children: [
      { id: 'newsletter-send', apiId: 331, labelKey: 'newsletterSend' },
    ],
  },
  {
    id: 'occasion',
    labelKey: 'occasion',
    children: [
      { id: 'occasion-congrats', labelKey: 'occasionCongrats' },
      { id: 'occasion-condolence', labelKey: 'occasionCondolence' },
      { id: 'occasion-social', labelKey: 'occasionSocial' },
      { id: 'occasion-job', labelKey: 'occasionJob' },
    ],
  },
];

export function resolveApiCategoryIds(selectedIds: string[]): {
  mainCategoryId?: number;
  subCategoryId?: number;
} {
  const selected = new Set(selectedIds);
  const apiIds: number[] = [];

  for (const parent of FILTER_CATEGORY_TREE) {
    if (selected.has(parent.id) && parent.apiId != null) {
      apiIds.push(parent.apiId);
    }
    for (const child of parent.children ?? []) {
      if (selected.has(child.id) && child.apiId != null) {
        apiIds.push(child.apiId);
      }
    }
  }

  if (apiIds.length === 0) return {};
  if (apiIds.length === 1) return { subCategoryId: apiIds[0] };
  return { mainCategoryId: apiIds[0], subCategoryId: apiIds[1] };
}

export function resolveIsReadFilter(
  statuses: NotificationFilterStatus[]
): boolean | undefined {
  const hasRead = statuses.includes('read');
  const hasUnread = statuses.includes('unread');
  if (hasRead === hasUnread) return undefined;
  return hasRead;
}
