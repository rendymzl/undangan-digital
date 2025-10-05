import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const categories = [
  { id: 'elegant', name: 'Elegant', color: 'bg-purple-100 text-purple-800' },
  { id: 'modern', name: 'Modern', color: 'bg-blue-100 text-blue-800' },
  { id: 'classic', name: 'Classic', color: 'bg-green-100 text-green-800' },
  { id: 'romantic', name: 'Romantic', color: 'bg-pink-100 text-pink-800' },
  { id: 'minimalist', name: 'Minimalist', color: 'bg-gray-100 text-gray-800' },
  { id: 'floral', name: 'Floral', color: 'bg-emerald-100 text-emerald-800' },
];

const colorSchemes = [
  { id: 'gold', name: 'Gold', color: 'bg-yellow-400' },
  { id: 'rose', name: 'Rose', color: 'bg-rose-400' },
  { id: 'blue', name: 'Blue', color: 'bg-blue-400' },
  { id: 'green', name: 'Green', color: 'bg-green-400' },
  { id: 'purple', name: 'Purple', color: 'bg-purple-400' },
  { id: 'neutral', name: 'Neutral', color: 'bg-gray-400' },
];

export default function TemplateFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedColors,
  onColorToggle,
  onClearFilters,
  className,
}: TemplateFiltersProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedColors.length > 0 || searchQuery.length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Cari template..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter Template</span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Category Filters */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Kategori</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-accent',
                  selectedCategories.includes(category.id) && category.color
                )}
                onClick={() => onCategoryToggle(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Color Scheme Filters */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Skema Warna</h4>
          <div className="flex flex-wrap gap-2">
            {colorSchemes.map((colorScheme) => (
              <div
                key={colorScheme.id}
                className={cn(
                  'flex items-center space-x-2 px-3 py-1 rounded-full border cursor-pointer transition-colors',
                  selectedColors.includes(colorScheme.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => onColorToggle(colorScheme.id)}
              >
                <div className={cn('w-3 h-3 rounded-full', colorScheme.color)} />
                <span className="text-xs font-medium">{colorScheme.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Filter Aktif</h4>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Search: "{searchQuery}"
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => onSearchChange('')}
                />
              </Badge>
            )}
            {selectedCategories.map((categoryId) => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {category?.name}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => onCategoryToggle(categoryId)}
                  />
                </Badge>
              );
            })}
            {selectedColors.map((colorId) => {
              const color = colorSchemes.find(c => c.id === colorId);
              return (
                <Badge key={colorId} variant="secondary" className="text-xs">
                  {color?.name}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => onColorToggle(colorId)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}