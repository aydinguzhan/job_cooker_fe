import { useEffect, useState } from "react";
import JobsCard from "../../components/jobs/JobsCard";
import { Pagination } from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";
import { getAllJobs, searchJobAndCompany } from "../../services/job.service";
import SearchInput from "../../components/ui/SearchInput";

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
  const [selectJob, setSelectJob] = useState<string | null>(null);
  const [jobsResponse, setJobResponse] = useState([]);
  const [pagenation, setPagenation] = useState({
    page: 0,
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

    if (!value.trim()) {
      setSearchResults([]);
    }
  };
  useEffect(() => {
    const getJobs = async () => {
      try {
        const data = await getAllJobs(currentPage);
        setJobResponse(data.rows || []);
        setPagenation({
          page: +data.page,
          size: +data.size,
          total: +data.total,
          totalPages: Math.ceil(+data.total / 10),
        });
      } catch (error) {
        console.error("İş ilanları getirilemedi:", error);
      }
    };
    getJobs();
  }, [currentPage]);
  useEffect(() => {
    // Arama kelimesi boşsa veya sadece boşluktan oluşuyorsa API isteği atmıyoruz
    if (!searchKey.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const res = await searchJobAndCompany(searchKey, 5);
        const rows = res?.data?.rows || res?.rows || [];
        setSearchResults(rows);
      } catch (error) {
        console.error("Arama servisinde hata oluştu:", error);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKey]);

  const selectedJobData = jobsResponse.find((job) => job.id === selectJob);

  return (
    <div className="flex h-dvh max-h-dvh flex-col gap-2 overflow-hidden p-2">
      <div className="flex shrink-0 items-center justify-between rounded-lg bg-surface p-4 text-lg font-semibold text-zinc-50">
        <div className="text-lg font-semibold text-app">Jobs</div>

        <div className="w-80">
          <SearchInput<JobSearchResult>
            placeholder="Search Job or Company..."
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
              <div className="flex flex-col w-full">
                <span className="font-semibold text-app">{job.title}</span>
                <span className="text-xs text-muted">{job.company_name}</span>
              </div>
            )}
          />
        </div>

        {isPermissonRecruiter && (
          <div className="flex items-center justify-center">
            <Button
              className="border border-white"
              color="secondary"
              size="sm"
              onClick={handleCreateJob}
            >
              <Plus size={16} />
              <span className="ml-2">Create Jobs</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 gap-2 bg-surface">
        <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto rounded-lg border">
          <div className="flex flex-col gap-2 p-2 font-semibold text-lg">
            {jobsResponse.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectJob(job.id)}
                className={`hover:cursor-pointer hover:opacity-60 ${
                  selectJob === job.id ? "bg-surface-strong" : ""
                }`}
              >
                <JobsCard jobInfo={job} compact />
              </div>
            ))}
          </div>
          <Pagination pagination={pagenation} onPageChange={setCurrentPage} />
        </div>

        <div className="min-h-0 flex-2 overflow-y-auto rounded-lg border p-2">
          {selectedJobData ? (
            <JobsCard
              key={selectedJobData.id}
              jobInfo={selectedJobData}
              onClick={() => null}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Select a job from the list to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
