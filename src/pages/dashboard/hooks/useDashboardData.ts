import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { getInvitationsByUser } from '@/features/invitations/invitationService';
import { invitationFromApi } from '@/utils/data-transform';
import type { Invitation } from '@/types';
import type { ActivityItem, QuickAction } from '@/types/dashboard';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  CreditCard,
  Plus,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';

export default function useDashboardData() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch invitations data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchInvitations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await getInvitationsByUser(user.id);
        
        if (fetchError) {
          throw new Error(fetchError.message || 'Failed to fetch invitations');
        }
        
        const transformedData: Invitation[] = (data || []).map(invitationFromApi);
        const sortedData = transformedData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setInvitations(sortedData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [user]);

  // Generate quick actions
  const quickActions = useMemo((): QuickAction[] => [
    {
      title: 'Buat Undangan Baru',
      description: 'Mulai membuat undangan digital dengan template yang menarik',
      icon: Plus,
      href: '/dashboard/pilih-template',
      color: 'blue',
    },
    {
      title: 'Kelola Tamu',
      description: 'Tambah, edit, atau impor daftar tamu undangan Anda',
      icon: Users,
      href: '/dashboard/guests',
      color: 'green',
    },
    {
      title: 'Lihat Statistik',
      description: 'Pantau performa undangan dan respons tamu',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'purple',
    },
    {
      title: 'Template Gallery',
      description: 'Jelajahi koleksi template undangan terbaru',
      icon: FileText,
      href: '/dashboard/templates',
      color: 'orange',
    },
  ], []);

  // Generate activity feed
  const activities = useMemo((): ActivityItem[] => {
    const activityList: ActivityItem[] = [];

    // Add invitation creation activities
    invitations.forEach(invitation => {
      const { mempelaiPria, mempelaiWanita, urutanMempelai } = invitation;
      const namaTampil = urutanMempelai === 'wanita-pria' 
        ? `${mempelaiWanita.nama} & ${mempelaiPria.nama}` 
        : `${mempelaiPria.nama} & ${mempelaiWanita.nama}`;

      activityList.push({
        id: `invitation-${invitation.id}`,
        type: 'invitation_created',
        title: 'Undangan Dibuat',
        description: `Undangan untuk ${namaTampil} berhasil dibuat`,
        timestamp: new Date(invitation.createdAt),
        metadata: {
          invitationId: invitation.id,
          coupleNames: namaTampil,
        },
      });

      // Add RSVP activities
      invitation.rsvp.forEach(rsvp => {
        if (rsvp.createdAt) {
          activityList.push({
            id: `rsvp-${rsvp.id}`,
            type: 'rsvp_received',
            title: 'RSVP Diterima',
            description: `${rsvp.nama} memberikan ucapan untuk ${namaTampil}`,
            timestamp: new Date(rsvp.createdAt),
            metadata: {
              invitationId: invitation.id,
              guestName: rsvp.nama,
              attendance: rsvp.kehadiran,
            },
          });
        }
      });

      // Add payment activities
      invitation.payment_proofs?.forEach(proof => {
        if (proof.created_at) {
          activityList.push({
            id: `payment-${proof.id}`,
            type: 'payment_made',
            title: 'Pembayaran Dilakukan',
            description: `Pembayaran untuk ${namaTampil} - Status: ${proof.status}`,
            timestamp: new Date(proof.created_at),
            metadata: {
              invitationId: invitation.id,
              paymentStatus: proof.status,
              amount: proof.amount,
            },
          });
        }
      });
    });

    return activityList.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [invitations]);

  const refreshData = async () => {
    if (!user) return;
    
    try {
      setError(null);
      const { data, error: fetchError } = await getInvitationsByUser(user.id);
      
      if (fetchError) {
        throw new Error(fetchError.message || 'Failed to refresh data');
      }
      
      const transformedData: Invitation[] = (data || []).map(invitationFromApi);
      const sortedData = transformedData.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setInvitations(sortedData);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  return {
    invitations,
    quickActions,
    activities,
    loading,
    error,
    refreshData,
  };
}