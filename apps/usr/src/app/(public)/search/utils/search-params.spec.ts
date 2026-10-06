import {
  EMPTY_SEARCH_STATE,
  SEARCH_QUERY_MAX_LENGTH,
  buildSearchHref,
  buildSearchQueryString,
  hasActiveFilters,
  normalizeSearchQuery,
  parseSearchParams,
} from '@search/utils/search-params';
import type { SearchUrlState } from '@search/types';

describe('normalizeSearchQuery', () => {
  it('normalizes Arabic letters and digits', () => {
    expect(normalizeSearchQuery('  كافه ۲۴ ')).toBe('کافه 24');
  });

  it('clamps to the search max length', () => {
    expect(normalizeSearchQuery('ا'.repeat(80))).toHaveLength(
      SEARCH_QUERY_MAX_LENGTH,
    );
  });
});

describe('parseSearchParams', () => {
  it('reads every field', () => {
    const state = parseSearchParams(
      new URLSearchParams(
        'q=کافه&service=discount&cat=coffee,snack&scat=loan,news&ptype=legal&utype=student,graduate&expand=products,users',
      ),
    );
    expect(state).toEqual({
      q: 'کافه',
      service: 'discount',
      categories: ['coffee', 'snack'],
      serviceCategories: ['loan', 'news'],
      providerTypes: ['legal'],
      userTypes: ['student', 'graduate'],
      expand: ['products', 'users'],
    });
  });

  it('drops malformed ids, unknown enum values and duplicates', () => {
    const state = parseSearchParams(
      new URLSearchParams(
        'service=discount&cat=coffee,<script>,coffee&expand=products,admins&ptype=legal,company&utype=gold,student',
      ),
    );
    expect(state.categories).toEqual(['coffee']);
    expect(state.expand).toEqual(['products']);
    expect(state.providerTypes).toEqual(['legal']);
    expect(state.userTypes).toEqual(['student']);
  });

  it('ignores categories without a service', () => {
    expect(
      parseSearchParams(new URLSearchParams('cat=coffee')).categories,
    ).toEqual([]);
  });

  it('returns the empty state for an empty URL', () => {
    expect(parseSearchParams(new URLSearchParams(''))).toEqual(
      EMPTY_SEARCH_STATE,
    );
  });
});

describe('buildSearchQueryString', () => {
  it('round-trips through parseSearchParams', () => {
    const state: SearchUrlState = {
      q: 'کتاب',
      service: 'discount',
      categories: ['book', 'stationery'],
      serviceCategories: ['housing'],
      providerTypes: ['individual'],
      userTypes: ['regular'],
      expand: ['services'],
    };
    expect(
      parseSearchParams(new URLSearchParams(buildSearchQueryString(state))),
    ).toEqual(state);
  });

  it('omits empty values and categories without a service', () => {
    expect(
      buildSearchQueryString({ ...EMPTY_SEARCH_STATE, categories: ['coffee'] }),
    ).toBe('');
  });
});

describe('buildSearchHref', () => {
  it('builds the route with an encoded query', () => {
    expect(buildSearchHref(' کافه ')).toBe(
      `/search?q=${encodeURIComponent('کافه')}`,
    );
  });

  it('returns the bare route for an empty query', () => {
    expect(buildSearchHref('   ')).toBe('/search');
  });
});

describe('hasActiveFilters', () => {
  it('is false for a query alone', () => {
    expect(hasActiveFilters({ ...EMPTY_SEARCH_STATE, q: 'کافه' })).toBe(false);
  });

  it('is true for any section filter', () => {
    expect(hasActiveFilters({ ...EMPTY_SEARCH_STATE, service: 'loan' })).toBe(
      true,
    );
    expect(
      hasActiveFilters({ ...EMPTY_SEARCH_STATE, userTypes: ['student'] }),
    ).toBe(true);
    expect(
      hasActiveFilters({ ...EMPTY_SEARCH_STATE, serviceCategories: ['loan'] }),
    ).toBe(true);
  });
});
