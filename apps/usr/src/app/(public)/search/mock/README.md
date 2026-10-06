# MOCK ONLY — global search

Fake data and fake implementations for `/search` until a search endpoint exists.

- Imported **only** by `@search/api` (never by components or hooks).
- Same shapes as `@search/types`; filtering, the 9-item preview and `expand` are simulated in memory,
  with the same request params the real endpoint will receive.
- Latency: 350 ms per call.
- Trending («پرجستجوترین‌های هفته»): 4 queries, each matching at least one product.
- Error path: the query `خطای آزمایشی` rejects, so the error state + retry can be checked.
- Product categories: `discount` → the discount category tree in `components/site/nav-data.ts`; every other
  service → the Figma placeholder tree («دسته بندی یک» … «دسته بندی چهار»).
- Every category option returns results: products are generated for categories without a hand-written one
  (`search-mock.spec.ts` checks every filter option).
- Filter trees = `CATEGORY_MENU_ITEMS` (discount) and `SERVICES_MENU_ITEMS` (services), mapped through the Figma
  label/order overrides in `search-mock.ts` (`DISCOUNT_LABELS`, `SERVICE_LABELS`, `CHILD_ORDER`).
- Providers carry a type (حقیقی / حقوقی), users a membership type.

Remove when the search API is integrated (`docs/07-integrations.md`).
