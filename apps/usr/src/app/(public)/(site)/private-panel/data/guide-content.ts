/** Structure types for private-panel guide (copy lives in messages/fa.json). */

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
