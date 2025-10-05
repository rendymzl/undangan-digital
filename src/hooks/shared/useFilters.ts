import { useState, useCallback, useMemo } from 'react';

export interface FilterValue {
  [key: string]: any;
}

export interface UseFiltersOptions {
  initialFilters?: FilterValue;
  onFiltersChange?: (filters: FilterValue) => void;
}

export default function useFilters(options: UseFiltersOptions = {}) {
  const { initialFilters = {}, onFiltersChange } = options;

  const [filters, setFilters] = useState<FilterValue>(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');

  const updateFilter = useCallback((key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [filters, onFiltersChange]);

  const updateFilters = useCallback((newFilters: FilterValue) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  const removeFilter = useCallback((key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    onFiltersChange?.({});
  }, [onFiltersChange]);

  const updateSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => 
      value !== undefined && value !== null && value !== ''
    ) || searchTerm.length > 0;
  }, [filters, searchTerm]);

  const activeFilterCount = useMemo(() => {
    const filterCount = Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
    return filterCount + (searchTerm.length > 0 ? 1 : 0);
  }, [filters, searchTerm]);

  // Helper function to apply filters to data
  const applyFilters = useCallback(<T extends Record<string, any>>(
    data: T[],
    searchFields: (keyof T)[] = []
  ): T[] => {
    let filteredData = [...data];

    // Apply search term
    if (searchTerm && searchFields.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredData = filteredData.filter(item => {
          const itemValue = item[key as keyof T];
          
          // Handle array values (for multi-select filters)
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          
          // Handle string comparison
          if (typeof value === 'string' && typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          
          // Handle exact match
          return itemValue === value;
        });
      }
    });

    return filteredData;
  }, [filters, searchTerm]);

  return {
    // State
    filters,
    searchTerm,
    hasActiveFilters,
    activeFilterCount,

    // Actions
    updateFilter,
    updateFilters,
    removeFilter,
    clearFilters,
    updateSearch,

    // Utilities
    applyFilters,
  };
}