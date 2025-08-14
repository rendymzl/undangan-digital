import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RSVP } from '@/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    rsvps: RSVP[];
}

// Helper untuk status kehadiran
const getStatusBadge = (status: RSVP['attendanceStatus']) => {
    switch (status) {
        case 'attending':
            return <Badge>Hadir</Badge>;
        case 'not_attending':
            return <Badge variant="destructive">Tidak Hadir</Badge>;
        default:
            return <Badge variant="secondary">Belum Pasti</Badge>;
    }
};

export const RSVPListModal: React.FC<Props> = ({ isOpen, onClose, rsvps }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Daftar Ucapan & Kehadiran</DialogTitle>
                    <DialogDescription>
                        Berikut adalah daftar ucapan dan konfirmasi kehadiran dari tamu Anda.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
                    {rsvps.length > 0 ? (
                        <div className="space-y-4">
                            {rsvps.map(rsvp => (
                                <Card key={rsvp.id}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-grow">
                                                <h3 className="font-semibold">{rsvp.guestName}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{rsvp.message}</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                {getStatusBadge(rsvp.attendanceStatus)}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {new Date(rsvp.createdAt || '').toLocaleString('id-ID')}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            Belum ada ucapan yang masuk.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};