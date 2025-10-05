import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface WizardStep {
    id: string;
    title: string;
    description?: string;
    component: React.ComponentType<any>;
    validation?: () => boolean | Promise<boolean>;
    optional?: boolean;
}

export interface FormWizardProps {
    steps: WizardStep[];
    currentStep: number;
    onStepChange: (step: number) => void;
    onComplete: () => void;
    onCancel?: () => void;
    data?: any;
    onDataChange?: (data: any) => void;
    loading?: boolean;
    className?: string;
    showProgress?: boolean;
    showStepNumbers?: boolean;
}

export default function FormWizard({
    steps,
    currentStep,
    onStepChange,
    onComplete,
    onCancel,
    data,
    onDataChange,
    loading = false,
    className = '',
    showProgress = true,
    showStepNumbers = true,
}: FormWizardProps) {
    const [validating, setValidating] = React.useState(false);

    const currentStepData = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;
    const progress = ((currentStep + 1) / steps.length) * 100;

    // Early return if no current step data
    if (!currentStepData) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-gray-500">Invalid step</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleNext = async () => {
        if (currentStepData.validation) {
            setValidating(true);
            try {
                const isValid = await currentStepData.validation();
                if (!isValid) {
                    setValidating(false);
                    return;
                }
            } catch (error) {
                console.error('Validation error:', error);
                setValidating(false);
                return;
            }
            setValidating(false);
        }

        if (isLastStep) {
            onComplete();
        } else {
            onStepChange(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            onStepChange(currentStep - 1);
        }
    };

    const handleStepClick = (stepIndex: number) => {
        // Only allow going to previous steps or current step
        if (stepIndex <= currentStep) {
            onStepChange(stepIndex);
        }
    };

    const StepComponent = currentStepData.component;

    return (
        <div className={`w-full max-w-4xl mx-auto ${className}`}>
            {/* Progress Bar */}
            {showProgress && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Langkah {currentStep + 1} dari {steps.length}
                        </span>
                        <span className="text-sm text-gray-500">
                            {Math.round(progress)}% selesai
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}

            {/* Step Navigation */}
            {showStepNumbers && (
                <div className="flex justify-center mb-6">
                    <div className="flex items-center space-x-4">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <button
                                    onClick={() => handleStepClick(index)}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${index === currentStep
                                        ? 'bg-blue-600 text-white'
                                        : index < currentStep
                                            ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700'
                                            : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                        }`}
                                    disabled={index > currentStep}
                                >
                                    {index + 1}
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Step Content */}
            <Card>
                <CardHeader>
                    <CardTitle>{currentStepData.title}</CardTitle>
                    {currentStepData.description && (
                        <p className="text-sm text-gray-600">{currentStepData.description}</p>
                    )}
                </CardHeader>
                <CardContent>
                    <StepComponent
                        data={data}
                        onDataChange={onDataChange}
                        currentStep={currentStep}
                        totalSteps={steps.length}
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div>
                        {onCancel && (
                            <Button
                                variant="ghost"
                                onClick={onCancel}
                                disabled={loading || validating}
                            >
                                Batal
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirstStep || loading || validating}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Sebelumnya
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={loading || validating}
                        >
                            {(loading || validating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isLastStep ? 'Selesai' : 'Selanjutnya'}
                            {!isLastStep && !(loading || validating) && <ChevronRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}