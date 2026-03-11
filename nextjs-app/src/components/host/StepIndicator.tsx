'use client';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition
                  ${isComplete ? 'bg-white text-black' : isActive ? 'bg-white/20 border-2 border-white text-white' : 'bg-zinc-800 border border-zinc-700 text-zinc-500'}
                `}>
                  {isComplete ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`mt-2 text-xs md:text-sm font-medium transition whitespace-nowrap ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 transition ${isComplete ? 'bg-white' : 'bg-zinc-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
