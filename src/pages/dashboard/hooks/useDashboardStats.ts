import { useState, useEffect, useMemo } from 'react';
import type { Invitation } from '@/types';
import type { DashboardStats } from '@/types/dashboard';

export interface UseDashboardStatsOptions {
  invitations: Invitation[];
}

export default function useDashboardStats({ invitations }: UseDashboardStatsOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo((): DashboardStats => {
    try {
      const now = new Date();
      
      // Calculate total invitations
      const totalInvitations = invitations.length;
      
      // Calculate active invitations (not expired)
      const activeInvitations = invitations.filter(invitation => {
        if (!invitation.expiredAt) return true; // Active forever
        return new Date(invitation.expiredAt) > now;
      }).length;
      
      // Calculate total guests from RSVP data
      const totalGuests = invitations.reduce((total, invitation) => {
        return total + invitation.rsvp.length;
      }, 0);
      
      // Calculate confirmed RSVPs
      const confirmedRSVPs = invitations.reduce((total, invitation) => {
        return total + invitation.rsvp.filter(rsvp => rsvp.kehadiran === 'hadir').length;
      }, 0);
      
      // Calculate pending RSVPs (those who haven't responded or said maybe)
      const pendingRSVPs = invitations.reduce((total, invitation) => {
        return total + invitation.rsvp.filter(rsvp => 
          rsvp.kehadiran === 'tidak_hadir' || !rsvp.kehadiran
        ).length;
      }, 0);

      return {
        totalInvitations,
        activeInvitations,
        totalGuests,
        confirmedRSVPs,
        pendingRSVPs,
      };
    } catch (err) {
      console.error('Error calculating dashboard stats:', err);
      return {
        totalInvitations: 0,
        activeInvitations: 0,
        totalGuests: 0,
        confirmedRSVPs: 0,
        pendingRSVPs: 0,
      };
    }
  }, [invitations]);

  // Calculate trends (simplified - could be enhanced with historical data)
  const trends = useMemo(() => {
    const recentInvitations = invitations.filter(invitation => {
      const createdDate = new Date(invitation.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    });

    const recentRSVPs = invitations.reduce((total, invitation) => {
      const recentResponses = invitation.rsvp.filter(rsvp => {
        if (!rsvp.createdAt) return false;
        const responseDate = new Date(rsvp.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return responseDate > sevenDaysAgo;
      });
      return total + recentResponses.length;
    }, 0);

    return {
      invitations: {
        value: recentInvitations.length > 0 ? 15 : 0, // Simplified trend calculation
        isPositive: recentInvitations.length > 0,
      },
      rsvps: {
        value: recentRSVPs > 0 ? 8 : 0, // Simplified trend calculation
        isPositive: recentRSVPs > 0,
      },
    };
  }, [invitations]);

  return {
    stats,
    trends,
    loading,
    error,
  };
}