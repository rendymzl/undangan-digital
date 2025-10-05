import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface DataTableFiltersProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onClear: () => void;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export default function DataTableFilters({
  filters,
  values,
  onChange,
  onClear,
  onSearch,
  searchPlaceholder = 'Cari...',
  className = ''
}: DataTableFiltersProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const hasActiveFilters = Object.values(values).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const renderFilter = (filter: FilterOption) => {
    const value = values[filter.key];

    switch (filter.type) {
      case 'text':
        return (
          <Input
            key={filter.key}
            placeholder={filter.placeholder || filter.label}
            value={value || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="w-full"
          />
        );

      case 'select':
        return (
          <Select
            key={filter.key}
            value={value || ''}
            onValueChange={(newValue) => onChange(filter.key, newValue)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.placeholder || `Pilih ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua {filter.label}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            key={filter.key}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="w-full"
          />
        );

      case 'number':
        return (
          <Input
            key={filter.key}
            type="number"
            placeholder={filter.placeholder || filter.label}
            value={value || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            Filter:
          </div>
          
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-600">
                {filter.label}
              </label>
              {renderFilter(filter)}
            </div>
          ))}

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}