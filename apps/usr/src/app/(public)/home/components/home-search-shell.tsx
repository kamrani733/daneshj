'use client';

import { useState, type ReactNode } from 'react';

import type { SearchQuery } from '../data/search-mock';
import { HomeSearchCategoryBar } from './home-header';
import { HomeSearchResults } from './home-search-results';

type HomeSearchShellProps = {
  /** Default home feed (hero → businesses). Hidden while search is active. */
  children: ReactNode;
  /** Motivation strip above footer — always visible. */
  motivation?: ReactNode;
  /** Always visible below the feed / results. */
  footer: ReactNode;
};

/**
 * Keeps the search bar mounted. On search, replaces the home feed with results
 * (motivation + footer stay). Mock filter today — swap for API later.
 */
export function HomeSearchShell({ children, motivation, footer }: HomeSearchShellProps) {
  const [activeSearch, setActiveSearch] = useState<SearchQuery | null>(null);

  return (
    <>
      <div className="relative z-10 mx-auto w-full max-w-[1512px] px-4 pb-16 min-[834px]:px-12 min-[1512px]:px-[100px]">
        <div className="flex flex-col gap-12 pt-6 min-[834px]:gap-12 min-[834px]:pt-8">
          <HomeSearchCategoryBar
            onSearch={(search) => setActiveSearch(search)}
            onClearSearch={() => setActiveSearch(null)}
          />

          {activeSearch ? <HomeSearchResults search={activeSearch} /> : children}
        </div>
      </div>

      <div className="relative z-10 mt-16 flex flex-col">
        {motivation}
        {footer}
      </div>
    </>
  );
}
