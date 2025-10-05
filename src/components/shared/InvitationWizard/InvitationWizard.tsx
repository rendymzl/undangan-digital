import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle,
  Save,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  isValid?: boolean;
  isOptional?: boolean;
}

export interface InvitationWizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onPreview: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function InvitationWizard({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onPrevious,
  onSave,
  onPreview,
  canGoNext,
  canGoPrevious,
  isLoading = false,
  children,
  className,
}: InvitationWizardProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={cn('max-w-6xl mx-auto py-8 px-4', className)}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Buat Undangan Digital</h1>
        <p className="text-muted-foreground">
          Ikuti langkah-langkah berikut untuk membuat undangan yang sempurna
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">
            Langkah {currentStep + 1} dari {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% selesai
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isAccessible = index <= currentStep;

            return (
              <div
                key={step.id}
                className="flex items-center flex-shrink-0"
              >
                <button
                  onClick={() => isAccessible && onStepChange(index)}
                  disabled={!isAccessible}
                  className={cn(
                    'flex flex-col items-center p-4 rounded-lg transition-all',
                    'hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed',
                    isActive && 'bg-primary/10 border-2 border-primary',
                    isCompleted && 'bg-green-50 border border-green-200'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors',
                      isCompleted && 'bg-green-500 text-white',
                      isActive && 'bg-primary text-primary-foreground',
                      !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : step.icon ? (
                      <step.icon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={cn(
                      'text-sm font-medium',
                      isActive && 'text-primary',
                      isCompleted && 'text-green-700'
                    )}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-24">
                      {step.description}
                    </div>
                    {step.isOptional && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Opsional
                      </Badge>
                    )}
                  </div>
                </button>
                
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-border mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                {currentStepData.icon && (
                  <currentStepData.icon className="h-5 w-5" />
                )}
                <span>{currentStepData.title}</span>
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {currentStepData.description}
              </p>
            </div>
            
            {currentStepData.isValid === false && (
              <div className="flex items-center text-destructive">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Perlu dilengkapi</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isLoading}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Sebelumnya</span>
        </Button>

        <div className="flex items-center space-x-3">
          {/* Save Draft Button */}
          <Button
            variant="outline"
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Draft</span>
          </Button>

          {/* Preview Button */}
          <Button
            variant="outline"
            onClick={onPreview}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>

          {/* Next/Finish Button */}
          <Button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="flex items-center space-x-2"
          >
            <span>{isLastStep ? 'Selesai' : 'Selanjutnya'}</span>
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}