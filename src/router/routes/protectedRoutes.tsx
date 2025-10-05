import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import BuatUndanganPage from '@/pages/dashboard/BuatUndanganPage';
import PilihTemplatePage from '@/pages/dashboard/PilihTemplatePage';
import UndangTamuPage from '@/pages/dashboard/UndangTamuPage';
import { ProtectedRoute } from '@/router/guards';

/**
 * Protected routes that require authentication
 */
export const ProtectedRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Layout />}>
      <Route index element={<DashboardPage />} />
      <Route path="buat-undangan" element={<BuatUndanganPage />} />
      <Route path="edit-undangan/:id" element={<BuatUndanganPage />} />
      <Route path="pilih-template" element={<PilihTemplatePage />} />
      <Route path="undang-tamu/:invitationId" element={<UndangTamuPage />} />
      <Route path="undang-tamu/" element={<UndangTamuPage />} />
    </Route>
  </Route>
);

export const protectedRouteConfig = [
  {
    path: '/dashboard',
    element: Layout,
    guard: 'protected' as const,
    meta: {
      title: 'Dashboard - Menantikan',
      description: 'Dashboard pengguna Menantikan',
      requiresAuth: true
    },
    children: [
      {
        path: '',
        element: DashboardPage,
        meta: {
          title: 'Dashboard - Menantikan',
          description: 'Kelola undangan pernikahan Anda'
        }
      },
      {
        path: 'buat-undangan',
        element: BuatUndanganPage,
        meta: {
          title: 'Buat Undangan - Menantikan',
          description: 'Buat undangan pernikahan baru'
        }
      },
      {
        path: 'edit-undangan/:id',
        element: BuatUndanganPage,
        meta: {
          title: 'Edit Undangan - Menantikan',
          description: 'Edit undangan pernikahan'
        }
      },
      {
        path: 'pilih-template',
        element: PilihTemplatePage,
        meta: {
          title: 'Pilih Template - Menantikan',
          description: 'Pilih template untuk undangan Anda'
        }
      },
      {
        path: 'undang-tamu/:invitationId',
        element: UndangTamuPage,
        meta: {
          title: 'Undang Tamu - Menantikan',
          description: 'Kelola dan undang tamu untuk pernikahan'
        }
      },
      {
        path: 'undang-tamu/',
        element: UndangTamuPage,
        meta: {
          title: 'Undang Tamu - Menantikan',
          description: 'Kelola dan undang tamu untuk pernikahan'
        }
      }
    ]
  }
];