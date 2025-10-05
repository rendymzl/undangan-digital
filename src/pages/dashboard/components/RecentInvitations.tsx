import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Users, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Invitation } from '@/types';

export interface RecentInvitationsProps {
  invitations: Invitation[];
  maxItems?: number;
  showViewAll?: boolean;
  className?: string;
}

function formatTanggalIndo(tanggal: string | null | undefined): string {
  if (!tanggal) return "-";
  const d = new Date(tanggal);
  if (isNaN(d.getTime())) return tanggal;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

function getStatusBadge(invitation: Invitation) {
  const latestProof = invitation.payment_proofs?.[0];
  const status = latestProof?.status;

  if (invitation.expiredAt) {
    const isExpired = new Date(invitation.expiredAt) < new Date();
    
    if (isExpired) {
      return <Badge variant="destructive">Kedaluwarsa</Badge>;
    }
    
    if (status === 'pending') {
      return <Badge variant="secondary">Menunggu Konfirmasi</Badge>;
    }
    
    if (status === 'rejected') {
      return <Badge variant="destructive">Pembayaran Ditolak</Badge>;
    }
    
    return <Badge variant="outline">Aktif Sementara</Badge>;
  }
  
  return <Badge className="bg-green-600 text-white">Aktif Selamanya</Badge>;
}

export default function RecentInvitations({
  invitations,
  maxItems = 3,
  showViewAll = true,
  className,
}: RecentInvitationsProps) {
  const recentInvitations = invitations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems);

  if (invitations.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Undangan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto mb-2" />
              <p>Belum ada undangan yang dibuat</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard/pilih-template">
                Buat Undangan Pertama
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Undangan Terbaru</CardTitle>
        {showViewAll && invitations.length > maxItems && (
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">
              Lihat Semua
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {recentInvitations.map((invitation) => {
          const { mempelaiPria, mempelaiWanita, akad, resepsi, urutanMempelai } = invitation;
          const namaTampil = urutanMempelai === 'wanita-pria' 
            ? `${mempelaiWanita.nama} & ${mempelaiPria.nama}` 
            : `${mempelaiPria.nama} & ${mempelaiWanita.nama}`;
          const tanggalAcara = akad.tanggal || resepsi.tanggal;
          const fullUrl = `${window.location.origin}/${invitation.slug}`;

          return (
            <div
              key={invitation.id}
              className="flex items-center space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm truncate">{namaTampil}</h4>
                  {getStatusBadge(invitation)}
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatTanggalIndo(tanggalAcara)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{invitation.rsvp.length} Ucapan</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                    <Link to={`/dashboard/edit-undangan/${invitation.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Lihat</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}