export interface GaleriFoto {
    url: string;      // Bisa URL dari Supabase atau blob URL lokal
    file?: File;      // Objek file mentah, hanya ada untuk upload baru
    caption?: string; // Caption opsional
}