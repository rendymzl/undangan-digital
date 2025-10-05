import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFooter?: boolean;
  className?: string;
}

export default function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText = 'Simpan',
  cancelText = 'Batal',
  onSubmit,
  onCancel,
  loading = false,
  disabled = false,
  size = 'md',
  showFooter = true,
  className = '',
}: FormModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'sm:max-w-[400px]';
      case 'md':
        return 'sm:max-w-[500px]';
      case 'lg':
        return 'sm:max-w-[700px]';
      case 'xl':
        return 'sm:max-w-[900px]';
      default:
        return 'sm:max-w-[500px]';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${getSizeClass()} ${className}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {children}
          </div>
        </ScrollArea>
        
        {showFooter && (
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
            {onSubmit && (
              <Button
                onClick={handleSubmit}
                disabled={disabled || loading}
                loading={loading}
              >
                {submitText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}