import { CATEGORY_MENU_ITEMS } from '@/components/site/nav-data';

export type SearchCategoryChip = {
  id: string;
  label: string;
};

const ALL_CHIP: SearchCategoryChip = { id: 'all', label: 'همه' };

function findCategoryGroup(category: string | null) {
  const cat = category?.trim();
  if (!cat) return null;

  for (const parent of CATEGORY_MENU_ITEMS) {
    const parentLabel = parent.label.trim();
    const children = parent.children ?? [];
    if (children.length === 0) continue;

    if (parentLabel === cat) {
      return { parentLabel, children };
    }

    if (children.some((child) => child.label.trim() === cat)) {
      return { parentLabel, children };
    }
  }

  return null;
}

/**
 * Subcategory chips under «N تخفیف فعال».
 * RTL order: «همه» first (visual right), then children (Figma Head content).
 */
export function getSearchCategoryChips(
  category: string | null
): SearchCategoryChip[] | null {
  const group = findCategoryGroup(category);
  if (!group) return null;

  return [
    ALL_CHIP,
    ...group.children.map((child) => ({
      id: child.id,
      label: child.label.trim(),
    })),
  ];
}

/** Parent category label when `category` is a leaf, otherwise the category itself. */
export function getParentCategoryLabel(category: string | null): string | null {
  const group = findCategoryGroup(category);
  return group?.parentLabel ?? category?.trim() ?? null;
}

/** Resolve which chip is selected from the active search category. */
export function getSelectedChipId(
  category: string | null,
  chips: SearchCategoryChip[] | null
): string {
  if (!chips?.length) return 'all';
  const cat = category?.trim();
  if (!cat) return 'all';

  const hit = chips.find((chip) => chip.id !== 'all' && chip.label === cat);
  return hit?.id ?? 'all';
}

/** Category label used for mock filtering when a chip is active. */
export function getChipFilterCategory(
  searchCategory: string | null,
  chipId: string,
  chips: SearchCategoryChip[] | null
): string | null {
  if (!chips?.length) return searchCategory?.trim() || null;
  if (chipId === 'all') return getParentCategoryLabel(searchCategory);
  return chips.find((chip) => chip.id === chipId)?.label ?? searchCategory;
}
