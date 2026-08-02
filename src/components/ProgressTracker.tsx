import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Circle, Sparkles } from 'lucide-react';
import { ResearchProgressStep } from '../types';

interface ProgressTrackerProps {
  steps: ResearchProgressStep[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps }) => {
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-md dark:border-blue-900/60 dark:from-blue-950/30 dark:to-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4 animate-spin" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Live Company Intelligence Pipeline
            </h3>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Crawling & AI Synthesis in progress
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="mb-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

      <div className="space-y-2">
        {steps.map((step) => {
          return (
            <div key={step.id} className="flex items-start gap-2.5 text-xs">
              <div className="mt-0.5 shrink-0">
                {step.status === 'completed' && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
                {step.status === 'in_progress' && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                )}
                {step.status === 'failed' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                {step.status === 'pending' && (
                  <Circle className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold ${
                    step.status === 'completed'
                      ? 'text-slate-700 dark:text-slate-300'
                      : step.status === 'in_progress'
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {step.label}
                </div>
                {step.detail && step.status !== 'pending' && (
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
