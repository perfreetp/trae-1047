import { Check } from 'lucide-react';

interface StepProgressProps {
  steps: { name: string; description?: string }[];
  currentStep: number;
}

export default function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="flex items-start">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={index} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-success-500 text-white'
                    : isCurrent
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <div className="mt-3 text-center">
                <p className={`text-sm font-medium ${
                  isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  isCompleted ? 'bg-success-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
