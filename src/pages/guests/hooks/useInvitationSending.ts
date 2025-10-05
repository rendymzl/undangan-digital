import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Guest } from '@/types/guest';

export interface SendingOptions {
  message: string;
  recipients: Guest[];
  personalizeMessage?: boolean;
}

export interface SendingResult {
  success: string[];
  failed: Array<{
    guestId: string;
    error: string;
  }>;
}

export interface UseInvitationSendingOptions {
  onSendComplete?: (result: SendingResult) => void;
  onProgress?: (progress: number) => void;
}

export default function useInvitationSending({
  onSendComplete,
  onProgress,
}: UseInvitationSendingOptions = {}) {
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [lastResult, setLastResult] = useState<SendingResult | null>(null);

  const generateWhatsAppLink = useCallback((guest: Guest, message: string) => {
    // Personalize message with guest data
    const personalizedMessage = message
      .replace(/\[Nama Tamu\]/g, guest.name)
      .replace(/\[Nama Mempelai\]/g, 'Ahmad & Siti') // This would come from invitation data
      .replace(/\[Tanggal Acara\]/g, '15 Februari 2024')
      .replace(/\[Waktu Acara\]/g, '08:00 - 12:00 WIB')
      .replace(/\[Lokasi Acara\]/g, 'Gedung Serbaguna, Jakarta')
      .replace(/\[Link Undangan\]/g, `https://menantikan.com/undangan/${guest.id}`)
      .replace(/\[Nama Pengirim\]/g, 'Keluarga Ahmad & Siti');

    const encodedMessage = encodeURIComponent(personalizedMessage);
    const phoneNumber = guest.phone?.replace(/[^\d]/g, '');
    
    if (!phoneNumber) {
      throw new Error('Nomor telepon tidak valid');
    }
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }, []);

  const sendToSingleGuest = useCallback(async (guest: Guest, message: string) => {
    try {
      const whatsappLink = generateWhatsAppLink(guest, message);
      
      // Open WhatsApp link
      window.open(whatsappLink, '_blank');
      
      // In a real app, you might want to track this differently
      // For now, we'll just simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [generateWhatsAppLink]);

  const sendBulkInvitations = useCallback(async (options: SendingOptions) => {
    const { message, recipients } = options;
    
    if (recipients.length === 0) {
      toast.error('Tidak ada penerima yang dipilih');
      return;
    }

    setIsSending(true);
    setSendingProgress(0);
    
    const result: SendingResult = {
      success: [],
      failed: [],
    };

    try {
      for (let i = 0; i < recipients.length; i++) {
        const guest = recipients[i];
        
        // Update progress
        const progress = ((i + 1) / recipients.length) * 100;
        setSendingProgress(progress);
        onProgress?.(progress);
        
        try {
          const sendResult = await sendToSingleGuest(guest, message);
          
          if (sendResult.success) {
            result.success.push(guest.id);
          } else {
            result.failed.push({
              guestId: guest.id,
              error: sendResult.error || 'Gagal mengirim',
            });
          }
        } catch (error) {
          result.failed.push({
            guestId: guest.id,
            error: error instanceof Error ? error.message : 'Gagal mengirim',
          });
        }
        
        // Add small delay between sends to avoid overwhelming
        if (i < recipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setLastResult(result);
      onSendComplete?.(result);
      
      // Show appropriate toast message
      if (result.failed.length === 0) {
        toast.success(`Berhasil mengirim ${result.success.length} undangan`);
      } else if (result.success.length === 0) {
        toast.error('Semua pengiriman gagal');
      } else {
        toast.warning(
          `${result.success.length} berhasil, ${result.failed.length} gagal`
        );
      }
      
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim undangan');
      console.error('Bulk send error:', error);
    } finally {
      setIsSending(false);
      setSendingProgress(0);
    }
  }, [sendToSingleGuest, onSendComplete, onProgress]);

  const sendToGuest = useCallback(async (guest: Guest, message: string) => {
    try {
      const result = await sendToSingleGuest(guest, message);
      
      if (result.success) {
        toast.success(`Link WhatsApp untuk ${guest.name} telah dibuka`);
      } else {
        toast.error(`Gagal mengirim ke ${guest.name}: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengirim';
      toast.error(`Gagal mengirim ke ${guest.name}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }, [sendToSingleGuest]);

  const retryFailedSends = useCallback(async (
    failedGuestIds: string[], 
    allGuests: Guest[], 
    message: string
  ) => {
    const failedGuests = allGuests.filter(g => failedGuestIds.includes(g.id));
    
    if (failedGuests.length === 0) {
      toast.error('Tidak ada pengiriman yang gagal untuk dicoba ulang');
      return;
    }

    await sendBulkInvitations({
      message,
      recipients: failedGuests,
    });
  }, [sendBulkInvitations]);

  const resetSendingState = useCallback(() => {
    setIsSending(false);
    setSendingProgress(0);
    setLastResult(null);
  }, []);

  return {
    // State
    isSending,
    sendingProgress,
    lastResult,
    
    // Actions
    sendBulkInvitations,
    sendToGuest,
    retryFailedSends,
    resetSendingState,
    
    // Utilities
    generateWhatsAppLink,
  };
}