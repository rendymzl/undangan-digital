import { useState, useMemo, useCallback } from 'react';

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

export default function usePagination(options: UsePaginationOptions = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    total = 0,
  } = options;

  const [current, setCurrent] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotal] = useState(total);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  const hasNext = useMemo(() => {
    return current < totalPages;
  }, [current, totalPages]);

  const hasPrevious = useMemo(() => {
    return current > 1;
  }, [current]);

  const startIndex = useMemo(() => {
    return (current - 1) * pageSize;
  }, [current, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize - 1, totalItems - 1);
  }, [startIndex, pageSize, totalItems]);

  const onChange = useCallback((page: number, size?: number) => {
    setCurrent(page);
    if (size && size !== pageSize) {
      setPageSize(size);
      // Reset to first page when page size changes
      setCurrent(1);
    }
  }, [pageSize]);

  const goToFirst = useCallback(() => {
    setCurrent(1);
  }, []);

  const goToLast = useCallback(() => {
    setCurrent(totalPages);
  }, [totalPages]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrent(prev => prev + 1);
    }
  }, [hasNext]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrent(prev => prev - 1);
    }
  }, [hasPrevious]);

  const reset = useCallback(() => {
    setCurrent(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  const paginationConfig: PaginationConfig = {
    current,
    pageSize,
    total: totalItems,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  return {
    // State
    current,
    pageSize,
    total: totalItems,
    totalPages,
    hasNext,
    hasPrevious,
    startIndex,
    endIndex,

    // Actions
    onChange,
    goToFirst,
    goToLast,
    goToNext,
    goToPrevious,
    reset,
    setTotal,

    // Config for components
    paginationConfig,
  };
}