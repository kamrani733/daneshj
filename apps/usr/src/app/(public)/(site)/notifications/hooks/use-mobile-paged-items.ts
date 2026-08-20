'use client';

import { useEffect, useMemo, useState } from 'react';

type UseMobilePagedItemsPayload<T> = {
  page: number;
  pageItems: T[];
  resetKey: string;
};

export function useMobilePagedItems<T>({
  page,
  pageItems,
  resetKey,
}: UseMobilePagedItemsPayload<T>) {
  const [mobilePages, setMobilePages] = useState<Record<number, T[]>>({});

  useEffect(() => {
    setMobilePages({});
  }, [resetKey]);

  useEffect(() => {
    setMobilePages((prev) => ({
      ...prev,
      [page]: pageItems,
    }));
  }, [pageItems, page]);

  const mobileItems = useMemo(
    () =>
      Array.from({ length: page }, (_, index) => index + 1).flatMap(
        (pageNumber) => mobilePages[pageNumber] ?? [],
      ),
    [mobilePages, page],
  );

  return { mobileItems };
}
