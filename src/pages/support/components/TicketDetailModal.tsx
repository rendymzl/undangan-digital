import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Paperclip, 
  Send, 
  Download,
  Clock,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from '@/services/shared/toastService';
import type { SupportTicket } from '../types/support';

interface TicketDetailModalProps {
  ticket: SupportTicket;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTicket: (ticketId: string, updates: Partial<SupportTicket>) => Promise<SupportTicket>;
  onAddMessage: (ticketId: string, message: string, attachments?: File[]) => Promise<void>;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateTicket,
  onAddMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'waiting-response': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'waiting-response': return <MessageSquare className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    try {
      await onAddMessage(ticket.id, newMessage.trim());
      setNewMessage('');
      toast.success('Pesan berhasil dikirim');
    } catch (error) {
      toast.error('Gagal mengirim pesan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await onUpdateTicket(ticket.id, { status: newStatus as any });
      toast.success('Status tiket berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui status tiket');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                #{ticket.id} - {ticket.subject}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {ticket.description}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Ticket Info */}
          <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              {ticket.category}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
            </div>
          </div>

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex-shrink-0 mb-4">
              <h4 className="text-sm font-medium mb-2">File Attachment:</h4>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded border">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{attachment.filename}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(attachment.size)})
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            <h4 className="text-sm font-medium">Percakapan:</h4>
            
            {ticket.messages.length > 0 ? (
              <div className="space-y-4">
                {ticket.messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>
                        {message.sender === 'user' ? 'U' : 'S'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 max-w-[80%] ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <Paperclip className="h-3 w-3" />
                                <span>{attachment.filename}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}>
                        <User className="h-3 w-3" />
                        <span>{message.sender === 'user' ? 'Anda' : 'Support'}</span>
                        <span>•</span>
                        <span>{new Date(message.timestamp).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                <p>Belum ada percakapan</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          {ticket.status !== 'closed' && (
            <div className="flex-shrink-0 space-y-3 border-t pt-4">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tulis pesan Anda..."
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {ticket.status === 'open' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange('closed')}
                    >
                      Tutup Tiket
                    </Button>
                  )}
                  {ticket.status === 'resolved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange('open')}
                    >
                      Buka Kembali
                    </Button>
                  )}
                </div>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Kirim
                </Button>
              </div>
            </div>
          )}

          {ticket.status === 'closed' && (
            <div className="flex-shrink-0 p-4 bg-gray-50 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Tiket ini telah ditutup. Jika Anda masih memerlukan bantuan, silakan buat tiket baru.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};