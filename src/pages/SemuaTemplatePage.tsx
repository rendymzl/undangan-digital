import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { themes, type Theme } from '@/types/theme';
import { ExternalLink } from 'lucide-react';
import type { Invitation } from '@/types';
import { invitationToApi, invitationFromApi } from '@/utils/data-transform';
import { dummyInvitationData } from '@/utils/test-data';
import { TemplateCardPreview } from './dashboard/TemplateCardPreview';
import { TemplateGrid } from '@/components/shared/TemplateGrid';

export default function SemuaTemplatePage() {

    // Fungsi untuk menangani preview di tab baru (sama seperti sebelumnya)
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
        <div className="w-full max-w-5xl mx-auto py-24 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">Galeri Template</h1>
                <p className="text-muted-foreground">Temukan desain yang sempurna untuk hari spesial Anda. Semua tema dapat disesuaikan.</p>
            </div>

            <TemplateGrid themes={themes} actionType="register" />
        </div>
    );
}