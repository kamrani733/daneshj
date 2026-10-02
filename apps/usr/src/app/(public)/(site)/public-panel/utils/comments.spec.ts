import type { PanelComment } from '@public-panel/types/ui';
import { filterAndSortComments } from '@public-panel/utils/comments';

function comment(id: string, extra: Partial<PanelComment> = {}): PanelComment {
  return {
    id,
    authorName: id,
    authorHandle: id,
    body: `body ${id}`,
    createdAt: '',
    kind: 'registered',
    likes: 0,
    dislikes: 0,
    shares: 0,
    ...extra,
  };
}

describe('filterAndSortComments', () => {
  it('keeps featured comments on top, preserving order inside each group', () => {
    const list = [
      comment('a'),
      comment('b', { featured: true }),
      comment('c'),
      comment('d', { featured: true }),
    ];
    expect(filterAndSortComments(list, '', 'date').map((c) => c.id)).toEqual([
      'b',
      'd',
      'a',
      'c',
    ]);
  });

  it('sorts by reply count', () => {
    const list = [
      comment('a'),
      comment('b', { replies: [comment('b1'), comment('b2')] }),
      comment('c', { replies: [comment('c1')] }),
    ];
    expect(filterAndSortComments(list, '', 'replies').map((c) => c.id)).toEqual([
      'b',
      'c',
      'a',
    ]);
  });

  it('applies the sort before lifting featured comments', () => {
    const list = [
      comment('a', { likes: 1 }),
      comment('b', { likes: 9 }),
      comment('c', { likes: 5, featured: true }),
    ];
    expect(
      filterAndSortComments(list, '', 'likes').map((c) => c.id)
    ).toEqual(['c', 'b', 'a']);
  });
});
