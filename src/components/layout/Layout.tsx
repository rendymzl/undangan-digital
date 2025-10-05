
import { Outlet } from 'react-router-dom';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { FeatureErrorBoundary } from '@/components/error-boundaries';

export default function Layout() {
  return (
    <FeatureErrorBoundary featureName="Dashboard Layout">
      <SidebarProvider>
        <FeatureErrorBoundary featureName="Sidebar" showMinimal>
          <AppSidebar />
        </FeatureErrorBoundary>
        <main className="w-full">
          <FeatureErrorBoundary featureName="Sidebar Trigger" showMinimal>
            <SidebarTrigger />
          </FeatureErrorBoundary>
          <FeatureErrorBoundary featureName="Main Content">
            <Outlet />
          </FeatureErrorBoundary>
        </main>
      </SidebarProvider>
    </FeatureErrorBoundary>
  );
}