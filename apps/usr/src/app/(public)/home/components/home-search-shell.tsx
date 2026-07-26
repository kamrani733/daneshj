'use client';

import { useState, type ReactNode } from 'react';

import { HomeSearchCategoryBar } from '@/components/site/site-header';

import type { SearchQuery } from '../data/search-mock';
import { HomeSearchResults } from './home-search-results';

type HomeSearchShellProps = {
  /** Default home feed (hero → businesses). Hidden while search is active. */
  children: ReactNode;
};

/**
 * Keeps the search bar mounted. On search, replaces the home feed with results.
 * Motivation + footer live in the site layout.
 */
export function HomeSearchShell({ children }: HomeSearchShellProps) {
  const [activeSearch, setActiveSearch] = useState<SearchQuery | null>(null);

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1512px] px-4 pb-16 min-[834px]:px-12 min-[1512px]:px-[100px]">
      <div
        className={
          activeSearch
            ? /* Figma: search bottom → head = 24px */
              'flex flex-col gap-6 pt-6 min-[834px]:pt-8'
            : 'flex flex-col gap-12 pt-6 min-[834px]:gap-12 min-[834px]:pt-8'
        }
      >
        <HomeSearchCategoryBar
          onSearch={(search) => setActiveSearch(search)}
          onClearSearch={() => setActiveSearch(null)}
        />

        {activeSearch ? <HomeSearchResults search={activeSearch} /> : children}
      </div>
    </div>
  );
}
