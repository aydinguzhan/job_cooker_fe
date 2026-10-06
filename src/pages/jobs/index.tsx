import { useEffect, useState } from "react";
import { BriefcaseBusiness, Building2, Search, Sparkles } from "lucide-react";
import JobsCard, { type IJobInfo } from "../../components/jobs/JobsCard";
import { Pagination } from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";
import { getAllJobs, searchJobAndCompany } from "../../services/job.service";
import SearchInput from "../../components/ui/SearchInput";
import { useTranslation } from "../../lang/useTranslation";

interface JobSearchResult {
  id: string;
  title: string;
  created_at: string;
  status: boolean;
  company_id: string;
  company_name: string;
  total_count: string;
}

export default function Jobs({
  isPermissonRecruiter,
  handleCreateJob,
}: {
  isPermissonRecruiter?: boolean;
  handleCreateJob?: () => void;
}) {
  const { t } = useTranslation();
  const [selectJob, setSelectJob] = useState<string | null>(null);
  const [jobsResponse, setJobResponse] = useState<IJobInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [pagenation, setPagenation] = useState({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState<JobSearchResult[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);
    if (!value.trim()) setSearchResults([]);
  };

  useEffect(() => {
    let isActive = true;
    const getJobs = async () => {
      try {
        setIsLoading(true);
        setLoadError(false);
        const data = await getAllJobs(currentPage);
        if (!isActive) return;
        const rows = data.rows || [];
        setJobResponse(rows);
        setPagenation({
          page: +data.page || currentPage,
          size: +data.size || 10,
          total: +data.total || 0,
          totalPages: Math.ceil((+data.total || 0) / (+data.size || 10)),
        });
        setSelectJob((selected) =>
          rows.some((job: IJobInfo) => job.id === selected)
            ? selected
            : (rows[0]?.id ?? null),
        );
      } catch (error) {
        console.error("İş ilanları getirilemedi:", error);
        if (isActive) setLoadError(true);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    getJobs();
    return () => {
      isActive = false;
    };
  }, [currentPage]);

  useEffect(() => {
    if (!searchKey.trim()) return;
    const timer = setTimeout(async () => {
      try {
        const res = await searchJobAndCompany(searchKey, 5);
        setSearchResults(res?.data?.rows || res?.rows || []);
      } catch (error) {
        console.error("Arama servisinde hata oluştu:", error);
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKey]);

  const selectedJobData = jobsResponse.find((job) => job.id === selectJob);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 pb-2">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-5 rounded-[1.75rem] border border-app bg-surface p-5 shadow-surface sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center justify-start gap-3">
          {isPermissonRecruiter && (
            <Button
              className="shrink-0 gap-2 whitespace-nowrap"
              fullWidth={false}
              size="sm"
              onClick={handleCreateJob}
            >
              <Plus size={16} />
              İlan oluştur
            </Button>
          )}
        </div>

        {isPermissonRecruiter && (
          <div className="col-span-2 row-start-2 mx-auto w-full sm:max-w-md lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:max-w-none">
            <SearchInput<JobSearchResult>
              placeholder={t("jobs.searchPlaceholder")}
              value={searchKey}
              onChange={handleSearchChange}
              searchResult={searchResults}
              getItemKey={(job) => job.id}
              onItemSelect={(job) => {
                setSelectJob(job.id);
                setSearchKey("");
                setSearchResults([]);
              }}
              renderItem={(job) => (
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-app">
                    {job.title}
                  </span>
                  <span className="truncate text-xs text-muted">
                    {job.company_name}
                  </span>
                </div>
              )}
            />
          </div>
        )}

        <div className="col-start-2 row-start-1 inline-flex items-center gap-2 justify-self-end rounded-xl border border-app bg-surface-muted px-3 py-2 text-sm font-medium text-muted lg:col-start-3">
          <BriefcaseBusiness
            size={16}
            className="text-cyan-600 dark:text-cyan-300"
          />
          <span>{pagenation.total + " " + t("jobs.job")}</span>
        </div>
      </header>

      <div className="grid min-h-[min(68vh,700px)] grid-cols-1 gap-4 lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.5fr)]">
        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-[1.5rem] border border-app bg-surface shadow-surface">
          <div className="flex items-center justify-between border-b border-app px-5 py-4">
            <div>
              <h2 className="font-semibold text-app">Açık pozisyonlar</h2>
              <p className="mt-0.5 text-xs text-soft">
                İlan seçerek detayları görüntüle
              </p>
            </div>
            <span className="rounded-full bg-surface-strong px-2.5 py-1 text-xs font-medium text-muted">
              {pagenation.total || jobsResponse.length}
            </span>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-app p-4"
                >
                  <div className="h-3 w-24 rounded bg-surface-strong" />
                  <div className="mt-3 h-4 w-4/5 rounded bg-surface-strong" />
                  <div className="mt-3 h-3 w-2/5 rounded bg-surface-strong" />
                </div>
              ))
            ) : loadError ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-8 text-center text-sm text-rose-600 dark:text-rose-300">
                İlanlar yüklenemedi. Lütfen sayfayı yenileyip tekrar dene.
              </div>
            ) : jobsResponse.length > 0 ? (
              jobsResponse.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectJob(job.id)}
                  aria-pressed={selectJob === job.id}
                  className={`group w-full rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                    selectJob === job.id
                      ? "border-cyan-500/50 bg-cyan-500/[0.07] shadow-sm"
                      : "border-app bg-surface-elevated hover:bg-surface-muted"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium text-soft">
                    <Building2
                      size={14}
                      className="text-cyan-600 dark:text-cyan-300"
                    />
                    <span className="truncate">
                      {job.company?.name || "Şirket bilgisi yok"}
                    </span>
                  </div>
                  <h3 className="line-clamp-2 font-semibold leading-6 text-app">
                    {job.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-soft">
                      {job.advertiser?.first_name} {job.advertiser?.last_name}
                    </span>
                    <span className="rounded-full bg-surface-strong px-2.5 py-1 text-[11px] font-semibold text-muted transition group-hover:bg-cyan-500/10 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                      Detayları gör
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-strong text-soft">
                  <Search size={20} />
                </div>
                <p className="mt-4 font-semibold text-app">
                  Henüz ilan bulunmuyor
                </p>
                <p className="mt-1 max-w-xs text-sm leading-6 text-soft">
                  Yeni fırsatlar yayınlandığında burada görüntülenecek.
                </p>
              </div>
            )}
          </div>

          {!isLoading && !loadError && (
            <div className="border-t border-app px-2">
              <Pagination
                pagination={pagenation}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </section>

        <section className="min-h-[420px] overflow-hidden rounded-[1.5rem] border border-app bg-surface shadow-surface">
          {selectedJobData ? (
            <JobsCard
              key={selectedJobData.id}
              jobInfo={selectedJobData}
              onClick={() => {
                if (selectedJobData.url) {
                  window.open(
                    selectedJobData.url,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }
              }}
            />
          ) : (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center px-8 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                <Sparkles size={24} />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-app">
                Sıradaki fırsatını keşfet
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-soft">
                Soldaki ilanlardan birini seç; pozisyon, şirket ve başvuru
                bilgilerini burada incele.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
