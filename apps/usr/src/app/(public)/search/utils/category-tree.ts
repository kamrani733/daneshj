import type { SearchCategoryOption } from '@search/types';

/** Leaf ids under an option (the option itself when it has no children). */
export function leafIds(option: SearchCategoryOption): string[] {
  const children = option.children ?? [];
  return children.length === 0 ? [option.id] : children.flatMap(leafIds);
}

/** Every leaf of a tree, in order (e.g. the service picker list). */
export function leafOptions(
  options: SearchCategoryOption[],
): SearchCategoryOption[] {
  return options.flatMap((option) =>
    option.children?.length ? leafOptions(option.children) : [option],
  );
}
