import { useState, useCallback } from 'react';
import { toast } from '@/services/shared/toastService';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export default function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: UseApiOptions = {}
  ) => {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = 'Operasi berhasil',
      onSuccess,
      onError,
    } = options;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}