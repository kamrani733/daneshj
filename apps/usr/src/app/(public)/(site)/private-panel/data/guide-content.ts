/** Structure types + guide body from messages/fa.json. */

import fa from '@messages/fa.json';

export type GuideBullet = string;

export type GuideSubBlock = {
  title: string;
  paragraphs?: string[];
  bullets?: GuideBullet[];
};

export type GuideCategory = {
  title: string;
  paragraphs?: string[];
  bullets?: GuideBullet[];
  subsections?: GuideSubBlock[];
};

export type GuideAccordionBlock = {
  id: string;
  title: string;
  intro: string[];
  categoriesLead?: string;
  categories?: GuideCategory[];
  outro?: string[];
};

export type GuideSectionBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: GuideBullet[];
};

export type GuideContentMessages = {
  fieldsIntro: string;
  edit: Omit<GuideAccordionBlock, 'id'>;
  confirm: Omit<GuideAccordionBlock, 'id'>;
  manage: Omit<GuideSectionBlock, 'id'>;
};

/** Body copy from `privatePanel.guide` (not via next-intl lookup). */
export function getGuideContentMessages(): GuideContentMessages {
  const guide = fa.privatePanel.guide;
  return {
    fieldsIntro: guide.fieldsIntro,
    edit: guide.edit as GuideContentMessages['edit'],
    confirm: guide.confirm as GuideContentMessages['confirm'],
    manage: guide.manage as GuideContentMessages['manage'],
  };
}

export function flattenGuideText(content: GuideContentMessages): string {
  const { fieldsIntro, edit, confirm, manage } = content;
  return [
    fieldsIntro,
    edit.title,
    ...edit.intro,
    edit.categoriesLead ?? '',
    ...(edit.categories ?? []).flatMap((category) => [
      category.title,
      ...(category.paragraphs ?? []),
      ...(category.bullets ?? []),
      ...(category.subsections ?? []).flatMap((sub) => [
        sub.title,
        ...(sub.paragraphs ?? []),
        ...(sub.bullets ?? []),
      ]),
    ]),
    ...(edit.outro ?? []),
    confirm.title,
    ...confirm.intro,
    manage.title,
    ...manage.paragraphs,
    ...(manage.bullets ?? []),
  ].join('\n');
}
