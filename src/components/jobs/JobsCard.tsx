import { ArrowUpRight, Building2, MapPin, Send, Star, UserRound } from "lucide-react";
import Button from "../ui/Button";

export type IJobInfo = {
  id: string;
  title: string;
  company: {
    name: string;
    email: string;
    address: string;
  };
  suitability_rate: string;
  advertiser: {
    first_name: string;
    last_name: string;
    company: string;
    bio: string;
  };
  description: string;
  url: string;
};

type Props = {
  jobInfo: IJobInfo;
  compact?: boolean;
  onClick?: () => void;
};

export default function JobsCard({ jobInfo, compact = false, onClick }: Props) {
  const { title, company, advertiser, description, suitability_rate } = jobInfo;
  const rating = Math.min(5, Math.max(0, Number(suitability_rate) || 0));

  return (
    <article className={`flex h-full flex-col ${compact ? "rounded-2xl border border-app bg-surface-elevated" : ""}`}>
      <div className="border-b border-app bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.10),_transparent_35%)] px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-app bg-surface text-cyan-700 shadow-sm dark:text-cyan-300">
          <Building2 size={22} />
        </div>
        <p className="mt-5 text-sm font-semibold text-cyan-700 dark:text-cyan-300">{company?.name || "Şirket bilgisi yok"}</p>
        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-app sm:text-3xl">{title}</h2>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {company?.address && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-app bg-surface/80 px-3 py-1.5 text-xs text-muted">
              <MapPin size={13} /> {company.address}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            Uygunluk {rating}/5
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-center gap-3 rounded-2xl border border-app bg-surface-muted p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-strong text-muted">
            <UserRound size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-soft">İlanı yayınlayan</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-app">
              {[advertiser?.first_name, advertiser?.last_name].filter(Boolean).join(" ") || "İşveren"}
            </p>
          </div>
          {advertiser?.company && <span className="ml-auto hidden rounded-full bg-surface-strong px-3 py-1 text-xs text-muted sm:inline-flex">{advertiser.company}</span>}
        </div>

        <div className="mt-7">
          <h3 className="text-sm font-semibold text-app">Pozisyon hakkında</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
            {description || "Bu ilan için henüz bir açıklama eklenmemiş."}
          </p>
        </div>

        {advertiser?.bio && (
          <div className="mt-6 rounded-2xl border border-app bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-soft">İşveren hakkında</p>
            <p className="mt-2 text-sm leading-6 text-muted">{advertiser.bio}</p>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-4 border-t border-app pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1" aria-label={`Uygunluk puanı ${rating} / 5`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={16} className={index < rating ? "fill-amber-400 text-amber-400" : "text-soft/40"} />
            ))}
            <span className="ml-2 text-xs text-soft">Profilinle eşleşme puanı</span>
          </div>
          <Button
            variant="secondary"
            size="md"
            fullWidth={false}
            className="gap-2"
            onClick={onClick}
            disabled={!jobInfo.url}
          >
            <Send size={16} />
            <span>Başvuruya git</span>
            <ArrowUpRight size={15} />
          </Button>
        </div>
      </div>
    </article>
  );
}
