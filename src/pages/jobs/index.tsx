import { useState } from "react";
import JobsCard from "../../components/jobs/JobsCard";

export default function Jobs() {
  const [selectJob, setSelectJob] = useState<string | null>(null);
  return (
    <div className="flex h-screen flex-col gap-2">
      <div className="shrink-0 rounded-lg bg-surface p-4 text-lg font-semibold text-zinc-50">
        <div>Jobs</div>
      </div>
      <div className="flex min-h-0 flex-1 gap-2 bg-surface">
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
          <div className="font-semibold text-lg p-2 flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <div
                  onClick={() => setSelectJob(index.toString())}
                  className={`hover:opacity-60 hover:cursor-pointer ${selectJob === index.toString() && "bg-surface-strong"} `}
                  key={index.toString()}
                >
                  <JobsCard
                    jobInfo={{
                      id: index.toString(),
                      companyName: "Meta",
                      title: "Senior Typescript Developer",
                      advertiserInfo: {
                        bio: "HR",
                        company: "ABC IT",
                        name: "John",
                        lastname: "Princ",
                      },
                      description: "5 Years Experince description",
                      suitabilityRate: index.toString(),
                    }}
                    compact
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-h-0 flex-2 overflow-y-auto ">
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              selectJob === index.toString() && (
                <div>
                  <JobsCard
                    key={index.toString()}
                    jobInfo={{
                      id: index.toString(),
                      companyName: "Meta",
                      title: "Senior Typescript Developer",
                      advertiserInfo: {
                        bio: "HR",
                        company: "ABC IT",
                        name: "John",
                        lastname: "Princ",
                      },
                      description: `
                      Job SummaryThe Marketing Specialist plans and executes digital campaigns to increase brand awareness and generate leads.
                       This role collaborates with the creative and sales teams to manage content and track campaign performance. 
                       (https://www.indeed.com/hire/c/info/roles-and-responsibilities-template)Key ResponsibilitiesCreate digital content for social media, email newsletters,
                        and the company website.Track daily campaign metrics and prepare weekly performance reports.Coordinate with external vendors and internal teams on project timelines.
                        Research market trends to identify new growth opportunities. [1] (https://standout-cv.com/job-descriptions/examples-of-awesome-job-descriptions),
                        (https://www.indeed.com/hire/c/info/roles-and-responsibilities-template)Required QualificationsEducation: Bachelor’s degree in Marketing, Communications,
                         or a related field.Experience: 2 years of experience in digital marketing or content creation.Skills: Strong written communication, basic graphic design knowledge,
                       and familiarity with Google Analytics. [1] (https://recruitee.com/blog/job-description-examples)
                      
                      `,
                      suitabilityRate: index.toString(),
                    }}
                    onClick={() => null}
                  />
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}
