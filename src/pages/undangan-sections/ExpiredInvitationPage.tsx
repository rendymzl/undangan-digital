import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TimerOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpiredInvitationPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                        <TimerOff size={32} />
                    </div>
                    <CardTitle>Undangan Tidak Aktif</CardTitle>
                    <CardDescription>
                        Masa aktif untuk undangan ini telah berakhir.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Jika Anda adalah pemilik undangan ini, silakan masuk ke dashboard Anda untuk mengaktifkannya kembali.
                    </p>
                    <Button asChild className="mt-6">
                        <Link to="/login">Login ke Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExpiredInvitationPage;