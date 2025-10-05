import { useState, useMemo } from 'react';
import type { Theme } from '@/types/theme';

export interface UseTemplateFiltersOptions {
  themes: Theme[];
}

export interface TemplateFilters {
  searchQuery: string;
  selectedCategories: string[];
  selectedColors: string[];
}

// Template categorization based on theme characteristics
const getThemeCategory = (theme: Theme): string[] => {
  const categories: string[] = [];
  
  // Categorize based on theme name and characteristics
  const name = theme.name.toLowerCase();
  
  if (name.includes('elegant') || name.includes('luxury')) {
    categories.push('elegant');
  }
  if (name.includes('modern') || name.includes('contemporary')) {
    categories.push('modern');
  }
  if (name.includes('classic') || name.includes('traditional')) {
    categories.push('classic');
  }
  if (name.includes('romantic') || name.includes('love')) {
    categories.push('romantic');
  }
  if (name.includes('minimal') || name.includes('simple')) {
    categories.push('minimalist');
  }
  if (name.includes('floral') || name.includes('flower')) {
    categories.push('floral');
  }
  
  // Default category if none match
  if (categories.length === 0) {
    categories.push('modern');
  }
  
  return categories;
};

// Color scheme categorization based on theme colors
const getThemeColorScheme = (theme: Theme): string[] => {
  const schemes: string[] = [];
  const primary = theme.colors.primary.toLowerCase();
  
  if (primary.includes('gold') || primary.includes('yellow') || primary.includes('#ffd700')) {
    schemes.push('gold');
  }
  if (primary.includes('rose') || primary.includes('pink') || primary.includes('#ff69b4')) {
    schemes.push('rose');
  }
  if (primary.includes('blue') || primary.includes('#0066cc')) {
    schemes.push('blue');
  }
  if (primary.includes('green') || primary.includes('#00cc66')) {
    schemes.push('green');
  }
  if (primary.includes('purple') || primary.includes('violet') || primary.includes('#9966cc')) {
    schemes.push('purple');
  }
  if (primary.includes('gray') || primary.includes('grey') || primary.includes('neutral')) {
    schemes.push('neutral');
  }
  
  // Default to neutral if no specific color detected
  if (schemes.length === 0) {
    schemes.push('neutral');
  }
  
  return schemes;
};

export default function useTemplateFilters({ themes }: UseTemplateFiltersOptions) {
  const [filters, setFilters] = useState<TemplateFilters>({
    searchQuery: '',
    selectedCategories: [],
    selectedColors: [],
  });

  const filteredThemes = useMemo(() => {
    let filtered = themes;

    // Apply search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(theme =>
        theme.name.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(theme => {
        const themeCategories = getThemeCategory(theme);
        return filters.selectedCategories.some(category =>
          themeCategories.includes(category)
        );
      });
    }

    // Apply color scheme filter
    if (filters.selectedColors.length > 0) {
      filtered = filtered.filter(theme => {
        const themeColors = getThemeColorScheme(theme);
        return filters.selectedColors.some(color =>
          themeColors.includes(color)
        );
      });
    }

    return filtered;
  }, [themes, filters]);

  const updateSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  const toggleColor = (color: string) => {
    setFilters(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color)
        ? prev.selectedColors.filter(c => c !== color)
        : [...prev.selectedColors, color]
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategories: [],
      selectedColors: [],
    });
  };

  const hasActiveFilters = filters.searchQuery.length > 0 || 
                          filters.selectedCategories.length > 0 || 
                          filters.selectedColors.length > 0;

  return {
    filters,
    filteredThemes,
    updateSearchQuery,
    toggleCategory,
    toggleColor,
    clearFilters,
    hasActiveFilters,
    totalResults: filteredThemes.length,
    totalThemes: themes.length,
  };
}