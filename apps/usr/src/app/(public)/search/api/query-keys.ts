import type { SearchRequest } from '@search/types';

export const searchKeys = {
  all: ['search'] as const,
  results: (request: SearchRequest) =>
    [...searchKeys.all, 'results', request] as const,
  serviceTree: () => [...searchKeys.all, 'service-tree'] as const,
  trending: () => [...searchKeys.all, 'trending'] as const,
  categoryOptions: (serviceId: string) =>
    [...searchKeys.all, 'category-options', serviceId] as const,
};
