import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface Props {
    expiryDate: string;
}

export const CountdownTimer: React.FC<Props> = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiryTime = new Date(expiryDate).getTime();
            const difference = expiryTime - now;

            if (difference <= 0) {
                setIsExpired(true);
                setTimeLeft('Tidak Aktif');
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryDate]);

    return (
        <Badge variant={isExpired ? "destructive" : "default"}>
            {isExpired ? 'Tidak Aktif' : `Aktif sisa: ${timeLeft}`}
        </Badge>
    );
};