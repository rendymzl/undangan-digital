import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, Heart, Star } from 'lucide-react';
import type { Theme, Invitation } from '@/types';
import { invitationToApi, invitationFromApi } from '@/utils/data-transform';
import { dummyInvitationData } from '@/utils/test-data';
import { TemplateCardPreview } from '@/pages/dashboard/TemplateCardPreview';
import TemplatePreviewModal from './TemplatePreviewModal';
import { cn } from '@/lib/utils';

// --- Props untuk komponen ini ---
interface TemplateGridProps {
    themes: Theme[];
    // Tentukan aksi tombol utama: 'select' (untuk user login) atau 'register' (untuk publik)
    actionType: 'select' | 'register';
    showFilters?: boolean;
    className?: string;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({ 
    themes, 
    actionType, 
    showFilters = false,
    className 
}) => {
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Fungsi preview tetap sama, karena logikanya tidak berubah
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

    const handleQuickPreview = (theme: Theme) => {
        setSelectedTheme(theme);
        setIsPreviewModalOpen(true);
    };

    const handleSelectTheme = (theme: Theme) => {
        window.location.href = `/dashboard/buat-undangan?themeId=${theme.id}`;
    };

    const toggleFavorite = (themeId: string) => {
        setFavorites(prev => 
            prev.includes(themeId) 
                ? prev.filter(id => id !== themeId)
                : [...prev, themeId]
        );
    };

    return (
        <>
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8", className)}>
                {themes.map((theme) => {
                    const isFavorite = favorites.includes(theme.id);
                    
                    return (
                        <Card
                            key={theme.id}
                            className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            style={{
                                backgroundColor: theme.colors.background,
                                color: theme.colors.foreground,
                            }}
                            onClick={() => handleQuickPreview(theme)}
                        >
                            {/* Header with title and favorite */}
                            <CardHeader className="relative">
                                <div className="flex items-center justify-between">
                                    <CardTitle className={`text-center flex-1 ${theme.fontText}`} style={{ color: theme.colors.primary }}>
                                        {theme.name}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(theme.id);
                                        }}
                                    >
                                        <Heart 
                                            className={cn(
                                                "h-4 w-4 transition-colors",
                                                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                                            )} 
                                        />
                                    </Button>
                                </div>
                                
                                {/* Premium badge */}
                                <div className="flex justify-center mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                        <Star className="h-3 w-3 mr-1" />
                                        Premium
                                    </Badge>
                                </div>
                            </CardHeader>

                            {/* Preview */}
                            <CardContent className="p-0 flex-grow">
                                <div className="border-y relative overflow-hidden" style={{ borderColor: theme.colors.secondary }}>
                                    <TemplateCardPreview theme={theme} />
                                    
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleQuickPreview(theme);
                                            }}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Quick Preview
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Actions */}
                            <CardFooter className="grid grid-cols-2 gap-3 p-4">
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreview(theme);
                                    }}
                                    className="w-full"
                                    style={{
                                        borderColor: theme.colors.primary,
                                        color: theme.colors.primary,
                                        background: theme.colors.background,
                                    }}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Preview
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectTheme(theme);
                                    }}
                                    className="w-full"
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        color: theme.colors.primaryForeground
                                    }}
                                >
                                    Pilih Tema
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Preview Modal */}
            <TemplatePreviewModal
                theme={selectedTheme}
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                onPreview={handlePreview}
                onSelect={handleSelectTheme}
            />
        </>
    );
};