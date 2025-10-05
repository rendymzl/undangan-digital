import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Star, Palette, Type } from 'lucide-react';
import type { Theme } from '@/types/theme';
import { TemplateCardPreview } from '@/pages/dashboard/TemplateCardPreview';
import { cn } from '@/lib/utils';

export interface TemplatePreviewModalProps {
  theme: Theme | null;
  isOpen: boolean;
  onClose: () => void;
  onPreview: (theme: Theme) => void;
  onSelect: (theme: Theme) => void;
  className?: string;
}

export default function TemplatePreviewModal({
  theme,
  isOpen,
  onClose,
  onPreview,
  onSelect,
  className,
}: TemplatePreviewModalProps) {
  if (!theme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('max-w-4xl max-h-[90vh] overflow-y-auto', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{theme.name}</span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Section */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <TemplateCardPreview theme={theme} />
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onPreview(theme)}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Lengkap
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:text-red-600"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p className="text-sm text-muted-foreground">
                {theme.description || `Template ${theme.name} dengan desain yang elegan dan modern. Cocok untuk berbagai jenis acara pernikahan dengan tampilan yang profesional dan menarik.`}
              </p>
            </div>

            {/* Color Scheme */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Skema Warna
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="text-xs">Primary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <span className="text-xs">Secondary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                  <span className="text-xs">Background</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.foreground }}
                  />
                  <span className="text-xs">Text</span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Type className="h-4 w-4 mr-2" />
                Tipografi
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Judul:</span>
                  <span className={`text-sm font-medium ${theme.fontTitle}`}>
                    {theme.fontTitle}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Teks:</span>
                  <span className={`text-sm ${theme.fontText}`}>
                    {theme.fontText}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Fitur Template</h3>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline" className="text-xs justify-center">
                  Responsive Design
                </Badge>
                <Badge variant="outline" className="text-xs justify-center">
                  Custom Colors
                </Badge>
                <Badge variant="outline" className="text-xs justify-center">
                  RSVP Form
                </Badge>
                <Badge variant="outline" className="text-xs justify-center">
                  Gallery Support
                </Badge>
                <Badge variant="outline" className="text-xs justify-center">
                  Music Player
                </Badge>
                <Badge variant="outline" className="text-xs justify-center">
                  Maps Integration
                </Badge>
              </div>
            </div>

            {/* Compatibility */}
            <div>
              <h3 className="font-semibold mb-2">Kompatibilitas</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  Mobile Friendly
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  All Browsers
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Fast Loading
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Tutup
          </Button>
          <Button
            onClick={() => onPreview(theme)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview Lengkap
          </Button>
          <Button
            onClick={() => onSelect(theme)}
            className="w-full sm:w-auto"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
          >
            Pilih Template Ini
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}