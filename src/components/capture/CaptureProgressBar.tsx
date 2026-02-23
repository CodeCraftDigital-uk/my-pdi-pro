import { Progress } from '@/components/ui/progress';

interface CaptureProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

const CaptureProgressBar = ({ currentStep, totalSteps, stepLabel }: CaptureProgressBarProps) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-xs font-bold text-slate-700">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs font-semibold text-slate-700 mt-1.5">{stepLabel}</p>
      </div>
    </div>
  );
};

export default CaptureProgressBar;
