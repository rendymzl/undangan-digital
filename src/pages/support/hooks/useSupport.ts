import { useState, useEffect } from 'react';
import useApi from '@/hooks/shared/useApi';
import type { SupportTicket } from '../types/support';
import { supportApi } from '../services/supportApi';

export const useSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  
  const ticketsApi = useApi<SupportTicket[]>();
  const createTicketApi = useApi<SupportTicket>();
  const updateTicketApi = useApi<SupportTicket>();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const ticketData = await ticketsApi.execute(() => supportApi.getSupportTickets());
      setTickets(ticketData);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const createTicket = async (ticketData: Partial<SupportTicket>) => {
    try {
      const newTicket = await createTicketApi.execute(
        () => supportApi.createSupportTicket(ticketData),
        {
          showSuccessToast: true,
          successMessage: 'Tiket berhasil dibuat',
        }
      );
      setTickets(prev => [newTicket, ...prev]);
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
    try {
      const updatedTicket = await updateTicketApi.execute(
        () => supportApi.updateSupportTicket(ticketId, updates),
        {
          showSuccessToast: false, // Handle toast in component
        }
      );
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId ? { ...ticket, ...updates } : ticket
        )
      );
      return updatedTicket;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  };

  const addTicketMessage = async (ticketId: string, message: string, attachments?: File[]) => {
    try {
      await supportApi.addTicketMessage(ticketId, message, attachments);

      // Update local state dengan pesan baru
      const newMessage: {
        id: string;
        sender: "user";
        message: string;
        timestamp: string;
        attachments?: { filename: string; url: string }[];
      } = {
        id: Date.now().toString(),
        sender: 'user',
        message,
        timestamp: new Date().toISOString(),
        ...(attachments && attachments.length > 0
          ? {
              attachments: attachments.map(file => ({
                filename: file.name,
                url: URL.createObjectURL(file),
              })),
            }
          : {}),
      };

      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                messages: [
                  ...ticket.messages,
                  // Pastikan attachments hanya ada jika memang ada, agar sesuai tipe
                  newMessage as typeof ticket.messages[number]
                ],
                updatedAt: new Date().toISOString(),
              }
            : ticket
        )
      );
    } catch (error) {
      console.error('Error adding ticket message:', error);
      throw error;
    }
  };

  const refreshTickets = () => {
    loadTickets();
  };

  return {
    tickets,
    isLoading: ticketsApi.loading || createTicketApi.loading || updateTicketApi.loading,
    error: ticketsApi.error || createTicketApi.error || updateTicketApi.error,
    createTicket,
    updateTicket,
    addTicketMessage,
    refreshTickets,
  };
};