import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { WizardStep } from '@/components/shared/InvitationWizard';

export interface UseInvitationWizardOptions {
  steps: WizardStep[];
  initialStep?: number;
  onStepValidation?: (stepIndex: number) => boolean;
  onSave?: () => Promise<void> | void;
  onPreview?: () => void;
  onComplete?: () => Promise<void> | void;
}

export default function useInvitationWizard({
  steps,
  initialStep = 0,
  onStepValidation,
  onSave,
  onPreview,
  onComplete,
}: UseInvitationWizardOptions) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    if (onStepValidation) {
      return onStepValidation(currentStep);
    }
    return true;
  }, [currentStep, onStepValidation]);

  // Check if we can go to next step
  const canGoNext = useMemo(() => {
    const isLastStep = currentStep === steps.length - 1;
    if (isLastStep) return true;
    
    return validateCurrentStep();
  }, [currentStep, steps.length, validateCurrentStep]);

  // Check if we can go to previous step
  const canGoPrevious = useMemo(() => {
    return currentStep > 0;
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Only allow going to steps that are accessible
      if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
        setCurrentStep(stepIndex);
      }
    }
  }, [steps.length, currentStep, completedSteps]);

  // Go to next step
  const nextStep = useCallback(async () => {
    if (!canGoNext) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const isLastStep = currentStep === steps.length - 1;
    
    if (isLastStep) {
      // Complete the wizard
      if (onComplete) {
        setIsLoading(true);
        try {
          await onComplete();
          toast.success('Undangan berhasil dibuat!');
        } catch (error) {
          toast.error('Gagal membuat undangan. Silakan coba lagi.');
          console.error('Error completing wizard:', error);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // Mark current step as completed and move to next
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  }, [canGoNext, currentStep, steps.length, onComplete]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (canGoPrevious) {
      setCurrentStep(prev => prev - 1);
    }
  }, [canGoPrevious]);

  // Save draft
  const saveDraft = useCallback(async () => {
    if (onSave) {
      setIsLoading(true);
      try {
        await onSave();
        toast.success('Draft berhasil disimpan');
      } catch (error) {
        toast.error('Gagal menyimpan draft');
        console.error('Error saving draft:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onSave]);

  // Preview invitation
  const previewInvitation = useCallback(() => {
    if (onPreview) {
      onPreview();
    }
  }, [onPreview]);

  // Get current step data
  const currentStepData = useMemo(() => {
    return steps[currentStep];
  }, [steps, currentStep]);

  // Calculate progress
  const progress = useMemo(() => {
    return ((currentStep + 1) / steps.length) * 100;
  }, [currentStep, steps.length]);

  // Check if step is completed
  const isStepCompleted = useCallback((stepIndex: number) => {
    return completedSteps.has(stepIndex);
  }, [completedSteps]);

  // Check if step is accessible
  const isStepAccessible = useCallback((stepIndex: number) => {
    return stepIndex <= currentStep || completedSteps.has(stepIndex - 1);
  }, [currentStep, completedSteps]);

  // Reset wizard
  const resetWizard = useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps(new Set());
    setIsLoading(false);
  }, [initialStep]);

  return {
    // State
    currentStep,
    currentStepData,
    completedSteps,
    isLoading,
    progress,
    
    // Computed
    canGoNext,
    canGoPrevious,
    
    // Actions
    goToStep,
    nextStep,
    previousStep,
    saveDraft,
    previewInvitation,
    resetWizard,
    
    // Utilities
    isStepCompleted,
    isStepAccessible,
    validateCurrentStep,
  };
}