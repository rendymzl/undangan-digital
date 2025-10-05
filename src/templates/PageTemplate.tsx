import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout';
import { FeatureErrorBoundary } from '@/components/error-boundaries';

interface PageTemplateProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
  featureName: string;
  className?: string;
}

/**
 * Standard page template for consistent layout across dashboard pages
 * 
 * Usage:
 * <PageTemplate
 *   title="Page Title"
 *   description="Page description"
 *   featureName="FeatureName"
 *   breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Current Page' }]}
 *   actions={<Button>Action</Button>}
 * >
 *   <YourPageContent />
 * </PageTemplate>
 */
export default function PageTemplate({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  featureName,
  className = '',
}: PageTemplateProps) {
  return (
    <FeatureErrorBoundary featureName={featureName}>
      <PageContainer className={className}>
        <div className="space-y-6">
          <PageHeader
            title={title}
            description={description}
            breadcrumbs={breadcrumbs}
            actions={actions}
          />
          
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </PageContainer>
    </FeatureErrorBoundary>
  );
}