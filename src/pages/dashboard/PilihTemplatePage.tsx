import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { themes, type Theme } from '@/types/theme';
import { TemplateCardPreview } from './TemplateCardPreview';
import { ExternalLink, Filter, Grid, List, Search } from 'lucide-react';
import type { Invitation } from '@/types';
import { invitationToApi, invitationFromApi } from '@/utils/data-transform';
import { dummyInvitationData } from '@/utils/test-data';
import { TemplateGrid } from '@/components/shared/TemplateGrid';
import TemplateFilters from '@/components/shared/TemplateFilters';
import useTemplateFilters from '@/hooks/shared/useTemplateFilters';
import { cn } from '@/lib/utils';

export default function PilihTemplatePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    filters,
    filteredThemes,
    updateSearchQuery,
    toggleCategory,
    toggleColor,
    clearFilters,
    hasActiveFilters,
    totalResults,
    totalThemes,
  } = useTemplateFilters({ themes });

  const handlePreview = (theme: Theme) => {
    const previewFormData = {
      ...dummyInvitationData,
      themeId: theme.id,
      fontTitle: theme.fontTitle,
      fontText: theme.fontText,
      customColors: theme.colors,
    };

    const mockApiData = invitationToApi(previewFormData);
    const invitationData: Invitation = invitationFromApi(mockApiData);

    sessionStorage.setItem('previewData', JSON.stringify(invitationData));
    window.open('/preview/draft', '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Pilih Template Undangan</h1>
        <p className="text-muted-foreground mb-6">
          Pilih desain yang paling sesuai dengan gaya pernikahan Anda.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
          <span>{totalThemes} template tersedia</span>
          {hasActiveFilters && (
            <Badge variant="secondary">
              {totalResults} hasil ditemukan
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={cn(
          "lg:w-80 space-y-6",
          showFilters ? "block" : "hidden lg:block"
        )}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateFilters
                searchQuery={filters.searchQuery}
                onSearchChange={updateSearchQuery}
                selectedCategories={filters.selectedCategories}
                onCategoryToggle={toggleCategory}
                selectedColors={filters.selectedColors}
                onColorToggle={toggleColor}
                onClearFilters={clearFilters}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          {filteredThemes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada template ditemukan</h3>
                <p className="text-muted-foreground mb-4">
                  Coba ubah filter atau kata kunci pencarian Anda.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Reset Filter
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TemplateGrid 
              themes={filteredThemes} 
              actionType="select"
              className={viewMode === 'list' ? 'grid-cols-1' : ''}
            />
          )}
        </div>
      </div>
    </div>
  );
}