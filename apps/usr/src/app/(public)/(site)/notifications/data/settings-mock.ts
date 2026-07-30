import { NOTIFICATIONS_PATH } from '@notifications/data/notifications-ui';

export const SETTINGS_PATH = `${NOTIFICATIONS_PATH}/settings`;

export type NotificationChannel = 'sms' | 'email' | 'telegram' | 'whatsapp';

export type ReceivePeriod = 'at_moment' | 'specified_time';

export type ChannelSettingState = {
  channel: NotificationChannel;
  isEnabled: boolean;
  receivePeriod: ReceivePeriod;
  receiveTimeStart: string | null;
  receiveTimeEnd: string | null;
};

export type SettingsEvent = {
  id: string;
  /** Backend category id for actor-settings create/list */
  categoryId: number;
  titleKey: string;
  channels: ChannelSettingState[];
};

export type SettingsCategory = {
  id: string;
  titleKey: string;
  events: SettingsEvent[];
};

export type SettingsSection = {
  id: string;
  titleKey: string;
  categories: SettingsCategory[];
};

/** Visual RTL order: SMS → Email → Telegram → WhatsApp (right → left). */
export const SETTINGS_CHANNELS: NotificationChannel[] = [
  'sms',
  'email',
  'telegram',
  'whatsapp',
];

function defaultChannels(
  enabled: NotificationChannel[] = ['email']
): ChannelSettingState[] {
  return SETTINGS_CHANNELS.map((channel) => ({
    channel,
    isEnabled: enabled.includes(channel),
    receivePeriod: 'at_moment' as const,
    receiveTimeStart: null,
    receiveTimeEnd: null,
  }));
}

function event(
  id: string,
  categoryId: number,
  titleKey: string,
  enabled?: NotificationChannel[]
): SettingsEvent {
  return { id, categoryId, titleKey, channels: defaultChannels(enabled) };
}

/** Figma settings tree — categoryId maps to actor-settings `category`. */
export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'manual',
    titleKey: 'manualSection',
    categories: [
      {
        id: 'authentication',
        titleKey: 'authentication',
        events: [
          event('login_logout', 101, 'loginLogout'),
          event('block_unblock', 102, 'blockUnblock'),
          event('restrict_unrestrict', 103, 'restrictUnrestrict'),
        ],
      },
      {
        id: 'user',
        titleKey: 'user',
        events: [
          event('membership_level', 111, 'membershipLevel'),
          event('e_card', 112, 'eCard'),
          event('become_provider', 113, 'becomeProvider'),
          event('collaboration_request', 114, 'collaborationRequest'),
        ],
      },
      {
        id: 'business',
        titleKey: 'business',
        events: [event('business_ops', 121, 'businessOps')],
      },
      {
        id: 'individual_provider',
        titleKey: 'individualProvider',
        events: [event('individual_ops', 131, 'individualOps')],
      },
      {
        id: 'organizer',
        titleKey: 'organizer',
        events: [event('organizer_ops', 141, 'organizerOps')],
      },
    ],
  },
  {
    id: 'display',
    titleKey: 'displaySection',
    categories: [
      {
        id: 'comment',
        titleKey: 'comment',
        events: [event('comment_ops', 201, 'commentOps')],
      },
      {
        id: 'ticket',
        titleKey: 'ticket',
        events: [
          event('ticket_operator', 211, 'ticketOperator'),
          event('ticket_leader', 212, 'ticketLeader'),
        ],
      },
      {
        id: 'local_networks',
        titleKey: 'localNetworks',
        events: [event('local_networks_ops', 221, 'localNetworksOps')],
      },
      {
        id: 'notifications',
        titleKey: 'notifications',
        events: [event('send_notifications', 231, 'sendNotifications')],
      },
      {
        id: 'message',
        titleKey: 'message',
        events: [event('message_ops', 241, 'messageOps')],
      },
      {
        id: 'ads',
        titleKey: 'ads',
        events: [event('ads_ops', 251, 'adsOps')],
      },
      {
        id: 'market',
        titleKey: 'market',
        events: [event('market_ops', 261, 'marketOps')],
      },
    ],
  },
  {
    id: 'services',
    titleKey: 'servicesSection',
    categories: [
      {
        id: 'discount',
        titleKey: 'discountService',
        events: [
          event('discount_receive', 301, 'discountReceive'),
          event('discount_define', 302, 'discountDefine'),
        ],
      },
      {
        id: 'reward',
        titleKey: 'rewardService',
        events: [
          event('reward_receive', 311, 'rewardReceive'),
          event('reward_calculate', 312, 'rewardCalculate'),
        ],
      },
      {
        id: 'news',
        titleKey: 'newsService',
        events: [
          event('news_upgrade', 321, 'newsUpgrade'),
          event('news_evaluate', 322, 'newsEvaluate'),
        ],
      },
      {
        id: 'newsletter',
        titleKey: 'newsletter',
        events: [
          event('newsletter_publish', 331, 'newsletterPublish'),
          event('newsletter_approve', 332, 'newsletterApprove'),
          event('newsletter_suspend', 333, 'newsletterSuspend'),
          event('newsletter_report', 334, 'newsletterReport'),
          event('newsletter_appeal', 335, 'newsletterAppeal'),
        ],
      },
      {
        id: 'calendar',
        titleKey: 'calendarEvents',
        events: [
          event('calendar_leader', 341, 'calendarLeader'),
          event('calendar_register', 342, 'calendarRegister'),
          event('calendar_user', 343, 'calendarUser'),
          event('calendar_suggest', 344, 'calendarSuggest'),
        ],
      },
      {
        id: 'hangout',
        titleKey: 'hangout',
        events: [
          event('hangout_topics', 351, 'hangoutTopics'),
          event('hangout_events', 352, 'hangoutEvents'),
          event('hangout_next_term', 353, 'hangoutNextTerm'),
        ],
      },
    ],
  },
];

export function flattenSettingsEvents(): SettingsEvent[] {
  return SETTINGS_SECTIONS.flatMap((section) =>
    section.categories.flatMap((category) => category.events)
  );
}

export function buildDefaultEventStates(): Record<string, ChannelSettingState[]> {
  const state: Record<string, ChannelSettingState[]> = {};
  for (const eventItem of flattenSettingsEvents()) {
    state[eventItem.id] = eventItem.channels.map((channel) => ({ ...channel }));
  }
  return state;
}

export function getEventIdByCategoryId(categoryId: number): string | undefined {
  return flattenSettingsEvents().find((eventItem) => eventItem.categoryId === categoryId)
    ?.id;
}

export function getCategoryIdByEventId(eventId: string): number | undefined {
  return flattenSettingsEvents().find((eventItem) => eventItem.id === eventId)
    ?.categoryId;
}
