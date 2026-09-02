import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "../../lang/useTranslation";

export type StepItem = {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
};

type StepperProps = {
  stepList: StepItem[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
  disableNext?: boolean;
  disablePrevious?: boolean;
};

export default function Stepper({
  stepList,
  currentStep,
  onNext,
  onPrevious,
  isSubmitting = false,
  disableNext = false,
  disablePrevious = false,
}: StepperProps) {
  const { t } = useTranslation();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === stepList.length - 1;
  const activeStep = stepList[currentStep];

  return (
    <div className="w-full rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl md:p-5 xl:p-6">
      <div className="grid gap-3 md:grid-cols-3">
        {stepList.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.id}
              className={`rounded-2xl border px-3 py-3 transition ${
                isCompleted
                  ? "border-emerald-400/20 bg-emerald-400/10"
                  : isActive
                    ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold ${
                    isCompleted
                      ? "border-emerald-400/30 bg-emerald-400 text-slate-950"
                      : isActive
                        ? "border-cyan-200/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/[0.04] text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isActive ? "text-white" : isCompleted ? "text-white" : "text-slate-200"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-4 md:p-5 xl:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            {t("common.step")} {currentStep + 1}
            {t("common.of")}
            {stepList.length}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {activeStep.title}
          </h2>
          {activeStep.description && (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
              {activeStep.description}
            </p>
          )}
        </div>

        <div>{activeStep.component}</div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep || isSubmitting || disablePrevious}
          className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("common.previous")}
        </button>

        <button
          type={isLastStep ? "submit" : "button"}
          onClick={isLastStep ? undefined : onNext}
          disabled={disableNext || isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? t("auth.creating")
            : isLastStep
              ? t("common.complete")
              : t("common.next")}
        </button>
      </div>
    </div>
  );
}
