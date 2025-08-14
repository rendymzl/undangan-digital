import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Theme, Invitation } from '@/types';
import { invitationToApi, invitationFromApi } from '@/utils/caseTransform';
import { dummyInvitationData } from '@/utils/dummyData';
import { TemplateCardPreview } from '@/pages/dashboard/TemplateCardPreview';

// --- Props untuk komponen ini ---
interface TemplateGridProps {
    themes: Theme[];
    // Tentukan aksi tombol utama: 'select' (untuk user login) atau 'register' (untuk publik)
    actionType: 'select' | 'register';
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({ themes, actionType }) => {

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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme) => {
                // Tentukan tujuan link dan teks tombol berdasarkan actionType
                const linkTo = actionType === 'select'
                    ? `/dashboard/buat-undangan?themeId=${theme.id}`
                    : `/register?themeId=${theme.id}`;

                const buttonText = actionType === 'select' ? 'Pilih' : 'Gunakan Tema Ini';

                return (
                    <Card
                        key={theme.id}
                        className="transition-shadow hover:shadow-xl" // Added flex flex-col
                        style={{
                            backgroundColor: theme.colors.background,
                            color: theme.colors.foreground,
                        }}
                    >
                        {/* --- 1. Judul Pindah ke CardHeader --- */}
                        <CardHeader>
                            <CardTitle className={`text-center ${theme.fontText}`} style={{ color: theme.colors.primary }}>
                                {theme.name}
                            </CardTitle>
                        </CardHeader>

                        {/* --- 2. Preview di dalam CardContent --- */}
                        <CardContent className="p-0 flex-grow">
                            <div className="border-y" style={{ borderColor: theme.colors.secondary }}>
                                <TemplateCardPreview theme={theme} />
                            </div>
                        </CardContent>

                        {/* --- 3. Tombol di dalam CardFooter --- */}
                        <CardFooter className="grid grid-cols-2 items-center justify-between gap-4">
                            <Button
                                variant="outline"
                                onClick={() => handlePreview(theme)}
                                className='w-full'
                                style={{
                                    borderColor: theme.colors.primary,
                                    color: theme.colors.primary,
                                    background: theme.colors.background,
                                }}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button asChild
                                className='w-full'
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    color: theme.colors.primaryForeground
                                }}>
                                <Link to={`/dashboard/buat-undangan?themeId=${theme.id}`}>
                                    Pilih Tema
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};