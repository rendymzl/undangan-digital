import React, { useState, useEffect } from 'react';
import type { Theme } from '@/types/theme'; // <-- 1. Import tipe Theme

// --- 2. Perbarui Props ---
interface CountdownProps {
    targetDate: string | null;
    theme: Theme; // Tambahkan theme sebagai prop
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, theme }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeft | null => {
            if (!targetDate) return null;
            const difference = +new Date(`${targetDate}T00:00:00`) - +new Date();
            if (difference <= 0) return null;

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        // Langsung set waktu saat komponen dimuat
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return null;
    }

    const timeUnits = [
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds },
    ];

    return (
        <div className="mt-8 flex justify-center space-x-2 sm:space-x-4">
            {timeUnits.map((unit, index) => (
                // --- 3. Terapkan Style dari Theme ---
                <div
                    key={index}
                    className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg p-2 shadow-lg"
                    style={{
                        backgroundColor: theme.primaryColor,
                        color: theme.backgroundColor,
                    }}
                >
                    <span className={`text-2xl sm:text-3xl font-bold ${theme.fontTitle}`}>
                        {unit.value.toString().padStart(2, '0')}
                    </span>
                    <span className={`text-xs sm:text-sm opacity-80 ${theme.fontText}`}>
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;