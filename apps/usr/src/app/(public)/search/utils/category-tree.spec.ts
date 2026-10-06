import { leafIds, leafOptions } from '@search/utils/category-tree';

describe('leafIds', () => {
  it('returns the option itself when it has no children', () => {
    expect(leafIds({ id: 'finance', label: 'مالی' })).toEqual(['finance']);
    expect(leafIds({ id: 'finance', label: 'مالی', children: [] })).toEqual([
      'finance',
    ]);
  });

  it('collects nested leaves', () => {
    expect(
      leafIds({
        id: 'cafe',
        label: 'کافه و رستوران',
        children: [
          { id: 'coffee', label: 'کافی شاپ' },
          {
            id: 'food',
            label: 'غذا',
            children: [{ id: 'restaurant', label: 'رستوران' }],
          },
        ],
      }),
    ).toEqual(['coffee', 'restaurant']);
  });
});

describe('leafOptions', () => {
  it('flattens a tree to its leaves in order', () => {
    expect(
      leafOptions([
        {
          id: 'financial',
          label: 'مالی',
          children: [
            { id: 'loan', label: 'وام دانشجویی' },
            { id: 'discount', label: 'تخفیف کالا و خدمات' },
          ],
        },
        { id: 'insurance', label: 'بیمه' },
      ]).map((option) => option.id),
    ).toEqual(['loan', 'discount', 'insurance']);
  });
});
