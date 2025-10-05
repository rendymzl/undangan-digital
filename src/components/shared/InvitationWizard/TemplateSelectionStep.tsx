import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Palette, Type, Star, Check } from 'lucide-react';
import type { Theme } from '@/types/theme';
import { themes } from '@/types/theme';
import { TemplateCardPreview } from '@/pages/dashboard/TemplateCardPreview';
import { cn } from '@/lib/utils';

export interface TemplateSelectionStepProps {
  selectedTheme?: Theme;
  onThemeSelect: (theme: Theme) => void;
  className?: string;
}

export default function TemplateSelectionStep({
  selectedTheme,
  onThemeSelect,
  className,
}: TemplateSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Semua Template' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'romantic', name: 'Romantic' },
  ];

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      theme.name.toLowerCase().includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Theme Info */}
      {selectedTheme && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Check className="h-5 w-5" />
              <span>Template Terpilih</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border">
                <TemplateCardPreview theme={selectedTheme} />
              </div>
              <div>
                <h3 className="font-semibold">{selectedTheme.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Template dengan desain yang elegan dan modern
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Customizable
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => {
          const isSelected = selectedTheme?.id === theme.id;
          
          return (
            <Card
              key={theme.id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-lg',
                isSelected && 'ring-2 ring-primary bg-primary/5'
              )}
              onClick={() => onThemeSelect(theme)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {theme.name}
                  </CardTitle>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="aspect-[3/4] border-y overflow-hidden">
                  <TemplateCardPreview theme={theme} />
                </div>
              </CardContent>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Type className="h-3 w-3" />
                    <span>{theme.fontTitle}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada template ditemukan</h3>
          <p className="text-muted-foreground">
            Coba ubah kata kunci pencarian atau filter kategori
          </p>
        </div>
      )}
    </div>
  );
}