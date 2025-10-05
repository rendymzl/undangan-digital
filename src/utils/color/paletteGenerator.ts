import Color from 'color';
import type { CustomColors } from '@/types';

/**
 * Memeriksa apakah sebuah warna hex itu terang.
 * Menggunakan formula YIQ untuk menentukan kecerahan persepsi.
 * @param hexColor Warna dalam format hex (e.g., '#RRGGBB').
 * @returns `true` jika warna terang, `false` jika gelap.
 */
function isColorLight(hexColor: string): boolean {
    try {
        const color = Color(hexColor);
        // Formula YIQ (luminance)
        const yiq = ((color.red() * 299) + (color.green() * 587) + (color.blue() * 114)) / 1000;
        return yiq >= 128;
    } catch (error) {
        return false; // Anggap gelap jika format warna salah
    }
}

/**
 * Menghasilkan palet warna yang harmonis dan aksesibel berdasarkan satu warna primer.
 * @param primaryColor Warna utama pilihan pengguna dalam format HEX.
 * @returns Objek CustomColors yang berisi palet lengkap.
 */
export function generatePalette(primaryColor: string): CustomColors {
    try {
        const baseColor = Color(primaryColor);

        // --- WARNA NETRAL (Selalu konsisten untuk kejelasan) ---
        const backgroundColor = '#FFFFFF'; // Latar belakang utama (putih)
        const foregroundColor = '#1a1a1a'; // Teks utama (abu-abu sangat gelap)

        // --- WARNA TURUNAN (Dihasilkan dari warna primer) ---
        // Warna Sekunder: Warna analogous yang sedikit lebih terang dan kurang jenuh.
        const secondaryColor = baseColor.rotate(15).saturate(-0.1).lighten(0.1).hex();

        // --- WARNA TEKS DINAMIS (Untuk kontras) ---
        // Jika warna primer terang, gunakan teks gelap. Jika tidak, gunakan teks terang.
        const primaryForeground = isColorLight(primaryColor) ? foregroundColor : backgroundColor;
        const secondaryForeground = isColorLight(secondaryColor) ? foregroundColor : backgroundColor;

        return {
            primary: baseColor.hex(),
            primaryForeground,
            secondary: secondaryColor,
            secondaryForeground,
            background: backgroundColor,
            foreground: foregroundColor,
        };
    } catch (error) {
        // Fallback jika input warna tidak valid (misal: pengguna mengetik "biru")
        console.error("Invalid color input for palette generator:", error);
        return {
            primary: '#8B5CF6',
            primaryForeground: '#FFFFFF',
            secondary: '#C4B5FD',
            secondaryForeground: '#4C1D95',
            background: '#F5F3FF',
            foreground: '#1F2937',
        };
    }
}