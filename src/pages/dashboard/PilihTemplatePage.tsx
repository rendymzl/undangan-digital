import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Import CardHeader, CardTitle, CardFooter
import { Button } from '@/components/ui/button';
import { themes, type Theme } from '@/types/theme';
import { TemplateCardPreview } from './TemplateCardPreview';
import { ExternalLink } from 'lucide-react';
import type { Invitation } from '@/types';
import { invitationToApi, invitationFromApi } from '@/utils/caseTransform';
import { dummyInvitationData } from '@/utils/dummyData';
import { TemplateGrid } from '@/components/shared/TemplateGrid';

export default function PilihTemplatePage() {

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
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Pilih Template Undangan</h1>
        <p className="text-muted-foreground">Pilih desain yang paling sesuai dengan gaya pernikahan Anda.</p>
      </div>

      <TemplateGrid themes={themes} actionType="select" />
    </div>
  );
}