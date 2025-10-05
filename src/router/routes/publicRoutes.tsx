import React from 'react';
import { Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import UndanganDetailPage from '@/pages/UndanganDetailPage';
import PreviewPage from '@/pages/PreviewPage';
import SemuaTemplatePage from '@/pages/SemuaTemplatePage';
import { NotFoundPage } from '@/pages/error';

/**
 * Public routes that don't require authentication
 */
export const PublicRoutes = () => (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/templates" element={<SemuaTemplatePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/preview/draft" element={<PreviewPage />} />
    <Route path="/:slug" element={<UndanganDetailPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);

export const publicRouteConfig = [
  {
    path: '/',
    element: LandingPage,
    meta: {
      title: 'Beranda - Menantikan',
      description: 'Platform undangan digital terbaik untuk pernikahan Anda'
    }
  },
  {
    path: '/templates',
    element: SemuaTemplatePage,
    meta: {
      title: 'Template Undangan - Menantikan',
      description: 'Pilih dari berbagai template undangan yang indah'
    }
  },
  {
    path: '/login',
    element: LoginPage,
    meta: {
      title: 'Masuk - Menantikan',
      description: 'Masuk ke akun Menantikan Anda'
    }
  },
  {
    path: '/register',
    element: RegisterPage,
    meta: {
      title: 'Daftar - Menantikan',
      description: 'Buat akun Menantikan baru'
    }
  },
  {
    path: '/preview/draft',
    element: PreviewPage,
    meta: {
      title: 'Preview Undangan - Menantikan',
      description: 'Preview undangan sebelum dipublikasi'
    }
  },
  {
    path: '/:slug',
    element: UndanganDetailPage,
    meta: {
      title: 'Undangan Pernikahan',
      description: 'Undangan pernikahan digital'
    }
  }
];