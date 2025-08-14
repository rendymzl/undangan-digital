import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Send } from "lucide-react";
import { themes, type Theme } from "@/types/theme";
import type { Invitation, RSVP } from '@/types';
import { CountdownTimer } from "./CountdownTimer";
import { InvitationCardPreview } from "./InvitationCardPreview";

// Fungsi format tanggal
function formatTanggalIndo(tanggal: string | null | undefined): string {
    if (!tanggal) return "-";
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return tanggal;
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(d);
}

// Props untuk komponen
interface InvitationCardProps {
    invitation: Invitation;
    onDelete: (id: string) => void;
    onOpenPaymentModal: (id: string) => void;
    onOpenProofModal: (invitation: Invitation) => void;
    onOpenRsvpModal: (rsvps: RSVP[]) => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
    invitation: inv,
    onDelete,
    onOpenPaymentModal,
    onOpenProofModal,
    onOpenRsvpModal,
}) => {
    const baseTheme = themes.find(t => t.id === inv.themeId) || themes[0];
    const finalColors = inv.customColors || baseTheme.colors;
    const { mempelaiPria, mempelaiWanita, akad, resepsi, urutanMempelai } = inv;

    const namaTampil = urutanMempelai === 'wanita-pria'
        ? `${mempelaiWanita.nama} & ${mempelaiPria.nama}`
        : `${mempelaiPria.nama} & ${mempelaiWanita.nama}`;

    const initials = urutanMempelai === 'wanita-pria'
        ? `${mempelaiWanita.nama[0] || ''}&${mempelaiPria.nama[0] || ''}`
        : `${mempelaiPria.nama[0] || ''}&${mempelaiWanita.nama[0] || ''}`;

    const tanggalAcara = akad.tanggal || resepsi.tanggal;
    const fullUrl = `${window.location.origin}/${inv.slug}`;
    const latestProof = inv.payment_proofs?.[0];
    const status = latestProof?.status;

    return (
        <Card
            className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden border"
            style={{
                background: finalColors.background,
                color: finalColors.foreground,
                borderColor: finalColors.secondary,
            }}
        >
            <InvitationCardPreview theme={baseTheme} initials={initials} />

            <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className={`truncate font-bold ${baseTheme.fontTitle}`}>{namaTampil}</CardTitle>
                    <span className="px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ backgroundColor: finalColors.secondary, color: finalColors.secondaryForeground }}>
                        {baseTheme.name}
                    </span>
                </div>
                <CardDescription style={{ color: finalColors.foreground, opacity: 0.8 }}>
                    {formatTanggalIndo(tanggalAcara)}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow p-4 space-y-4">
                {/* Status Undangan */}
                <div className="flex flex-col gap-2">
                    {inv.expiredAt ? (
                        status === 'pending' ? (
                            <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300 w-fit" onClick={() => onOpenProofModal(inv)}>
                                Menunggu Konfirmasi
                            </Badge>
                        ) : status === 'rejected' ? (
                            <Badge variant="destructive" className="cursor-pointer hover:bg-red-700 w-fit" onClick={() => onOpenProofModal(inv)}>
                                Pembayaran Ditolak
                            </Badge>
                        ) : (
                            <div className="flex items-center gap-3 flex-wrap justify-between">
                                <CountdownTimer expiryDate={inv.expiredAt} />
                                <Button size="sm" onClick={() => onOpenPaymentModal(inv.id)} className="ml-1">
                                    Aktifkan
                                </Button>
                            </div>
                        )
                    ) : (
                        <Badge className="bg-green-600 text-white w-fit">Aktif Selamanya</Badge>
                    )}
                </div>
                {/* Info RSVP */}
                <button className="text-sm hover:underline text-left" style={{ color: finalColors.primary }} onClick={() => onOpenRsvpModal(inv.rsvp)}>
                    {inv.rsvp.length} Ucapan Masuk
                </button>
            </CardContent>

            <CardFooter className="p-4 flex justify-between items-center border-t" style={{ borderColor: finalColors.secondary }}>
                <Button asChild size="sm" variant="outline" className="h-9 flex items-center gap-2 rounded-lg font-medium" title="Undang Tamu">
                    <Link to={`/dashboard/undang-tamu/${inv.id}`} className="flex items-center gap-1">
                        <Send size={16} />
                        <span className="hidden sm:inline">Undang Tamu</span>
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button asChild size="sm" variant="ghost" className="p-2 h-9 w-9" title="Lihat Undangan Langsung">
                        <a href={fullUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a>
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="p-2 h-9 w-9" title="Edit">
                        <Link to={`/dashboard/edit-undangan/${inv.id}`}><Pencil size={16} /></Link>
                    </Button>
                    <Button size="sm" variant="destructive" className="p-2 h-9 w-9" title="Hapus" onClick={() => onDelete(inv.id)}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};