import { Sparkles } from "lucide-react";
import { useTranslation } from "../../lang/useTranslation";

type Props = {
  onClick: () => void;
};

export default function AiButton({ onClick }: Props) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group fixed bottom-5 left-1/2 z-40
        inline-flex -translate-x-1/2 items-center gap-2 overflow-hidden
        rounded-2xl border border-violet-200/70
        bg-gradient-to-r from-slate-950 via-violet-950 to-slate-950
        px-4 py-2.5 text-sm font-semibold text-white
        shadow-lg shadow-violet-950/20
        transition-all duration-300
        hover:-translate-y-[calc(0.125rem+50%)] hover:shadow-xl hover:shadow-violet-950/30
        active:translate-y-0
        md:left-auto md:right-6 md:translate-x-0 md:hover:-translate-y-0.5
      "
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />

      <span className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
        <Sparkles
          size={16}
          className="text-violet-200 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
        />
      </span>

      <span className="relative">{t("aiProfile.openButton")}</span>

      <span className="relative rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-violet-100 ring-1 ring-white/15">
        {t("aiProfile.beta")}
      </span>
    </button>
  );
}
