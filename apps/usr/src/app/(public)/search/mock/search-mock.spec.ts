// MOCK ONLY — guards that every filter option of the mock search returns results.
import {
  DISCOUNT_CATEGORY_TREE,
  DISCOUNT_SERVICE_ID,
  SERVICE_TREE,
  mockGetTrendingSearches,
  placeholderCategories,
  searchMockData,
} from '@search/mock/search-mock';
import { PROVIDER_TYPE_IDS, USER_TYPE_IDS } from '@search/types';
import { leafIds, leafOptions } from '@search/utils/category-tree';
import { EMPTY_SEARCH_STATE } from '@search/utils/search-params';

const search = (patch: Partial<typeof EMPTY_SEARCH_STATE>) =>
  searchMockData({ ...EMPTY_SEARCH_STATE, ...patch });

describe('mock search filters', () => {
  it('returns everything without filters', () => {
    const all = search({});
    expect(all.products.total).toBeGreaterThan(0);
    expect(all.services.total).toBe(leafOptions(SERVICE_TREE).length);
    expect(all.total).toBe(
      all.products.total +
        all.services.total +
        all.providers.total +
        all.users.total,
    );
  });

  it('filters products by service', () => {
    const result = search({
      service: DISCOUNT_SERVICE_ID,
      expand: ['products'],
    });
    expect(result.products.total).toBeGreaterThan(0);
    expect(result.products.total).toBeLessThan(search({}).products.total);
    expect(
      result.products.items.every(
        (item) => item.serviceTitle === 'تخفیف کالا و خدمات',
      ),
    ).toBe(true);
  });

  it('every discount category returns products', () => {
    for (const main of DISCOUNT_CATEGORY_TREE) {
      const ids = leafIds(main);
      const narrowed = search({
        service: DISCOUNT_SERVICE_ID,
        categories: ids,
      });
      expect(narrowed.products.total).toBeGreaterThan(0);
      for (const leaf of ids) {
        expect(
          search({ service: DISCOUNT_SERVICE_ID, categories: [leaf] }).products
            .total,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('every category of another service returns its products', () => {
    for (const leaf of leafOptions(placeholderCategories('loan'))) {
      const result = search({
        service: 'loan',
        categories: [leaf.id],
        expand: ['products'],
      });
      expect(result.products.total).toBe(1);
      expect(result.products.items[0].serviceTitle).toBe('وام دانشجویی');
    }
  });

  it('filters services by the services tree', () => {
    const welfare = SERVICE_TREE.find((main) => main.id === 'welfare');
    expect(welfare).toBeDefined();
    const ids = leafIds(welfare as NonNullable<typeof welfare>);
    const result = search({ serviceCategories: ids });
    expect(result.services.items.map((item) => item.id)).toEqual(ids);
  });

  it('filters providers and users by type', () => {
    for (const type of PROVIDER_TYPE_IDS) {
      const result = search({ providerTypes: [type] });
      expect(result.providers.total).toBeGreaterThan(0);
      expect(result.providers.total).toBeLessThan(search({}).providers.total);
    }
    for (const type of USER_TYPE_IDS) {
      const result = search({ userTypes: [type] });
      expect(result.users.total).toBeGreaterThan(0);
      expect(result.users.total).toBeLessThan(search({}).users.total);
    }
  });

  it('combines the query with filters', () => {
    const result = search({ q: 'سارا', userTypes: ['student'] });
    expect(result.users.items.map((item) => item.username)).toEqual([
      'sara.ahmadi',
    ]);
    expect(search({ q: 'سارا', userTypes: ['graduate'] }).users.total).toBe(0);
  });

  it('every trending query returns results', async () => {
    jest.useFakeTimers();
    const pending = mockGetTrendingSearches();
    jest.runAllTimers();
    const trending = await pending;
    jest.useRealTimers();
    expect(trending.length).toBeGreaterThan(0);
    for (const item of trending) {
      expect(search({ q: item.query }).total).toBeGreaterThan(0);
    }
  });

  it('returns nothing for an unknown query', () => {
    expect(search({ q: 'عبارتی-که-وجود-ندارد' }).total).toBe(0);
  });
});
