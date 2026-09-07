import { useEffect, useState } from "react";
import JobsCard from "../../components/jobs/JobsCard";
import apiClient from "../../lib/axios";
import { Pagination } from "../../components/ui/Pagination";

export default function Jobs() {
  const [selectJob, setSelectJob] = useState<string | null>(null);
  const [jobsResponse, setJobResponse] = useState([]);
  const [pagenation, setPagenation] = useState({
    page: 0,
    size: 10,
    total: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getJobs = async () => {
      const { data } = await apiClient.get(
        `/jobs/search?page=${currentPage}&size=10`,
      );
      setJobResponse(data.data.rows);
      setPagenation({
        page: +data.data.page,
        size: +data.data.size,
        total: +data.data.total,
        totalPages: Math.round(+data.data.total / 10),
      });
    };
    getJobs();
  }, [currentPage]);
  return (
    <div className="flex h-screen flex-col gap-2">
      <div className="shrink-0 rounded-lg bg-surface p-4 text-lg font-semibold text-zinc-50">
        <div>Jobs</div>
      </div>
      <div className="flex min-h-0 flex-1 gap-2 bg-surface">
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
          <div className="font-semibold text-lg p-2 flex flex-col gap-2">
            {jobsResponse.map((job) => {
              return (
                <>
                  <div
                    onClick={() => setSelectJob(job.id)}
                    className={`hover:opacity-60 hover:cursor-pointer ${selectJob === job.id && "bg-surface-strong"} `}
                    key={job.id}
                  >
                    <JobsCard jobInfo={job} compact />
                  </div>
                </>
              );
            })}
          </div>
          <Pagination pagination={pagenation} onPageChange={setCurrentPage} />
        </div>
        <div className="min-h-0 flex-2 overflow-y-auto ">
          {jobsResponse.map((job) => {
            return (
              selectJob === job.id && (
                <div>
                  <JobsCard key={job.id} jobInfo={job} onClick={() => null} />
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}
