import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/hooks/shared';

// Template for creating new hooks
// Copy this file and rename it to your hook name

interface HookTemplateOptions {
  // Define your options here
  initialValue?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface HookTemplateReturn {
  // Define your return type here
  data: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  reset: () => void;
}

/**
 * Hook description
 * 
 * @param options - Hook options
 * @returns Hook return object
 * 
 * Usage:
 * const { data, loading, error, refetch } = useHookTemplate({
 *   initialValue: null,
 *   onSuccess: (data) => console.log('Success:', data),
 * });
 */
export default function useHookTemplate(
  options: HookTemplateOptions = {}
): HookTemplateReturn {
  const { initialValue, onSuccess, onError } = options;
  
  const [data, setData] = useState(initialValue);
  const { execute, loading, error } = useApi();

  const fetchData = useCallback(async () => {
    try {
      const result = await execute(async () => {
        // Your API call here
        return Promise.resolve(null);
      });
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      onError?.(err as Error);
    }
  }, [execute, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Initialize data if needed
    // fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  };
}

// Export types if needed
export type { HookTemplateOptions, HookTemplateReturn };