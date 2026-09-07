import { Send, Star } from "lucide-react";
import Button from "../ui/Button";

type Props = {
  jobInfo: {
    id: string;
    title: string;
    companyName: string;
    suitability_rate: string;
    advertiser: {
      first_name: string;
      last_name: string;
      company: string;
      bio: string;
    };
    description: string;
  };
  compact?: boolean;
  onClick?: (id?: string) => void;
};

export default function JobsCard({ jobInfo, compact = false, onClick }: Props) {
  const { id, title, companyName, advertiser, description, suitability_rate } =
    jobInfo;
  return (
    <div
      className={`rounded-lg flex flex-col justify-start  flex-1  ${compact && "border"}`}
    >
      <div className="p-2">
        <div
          className={`font-semibold text-lg mb-2  border-b py-2 px-1 ${!compact && "text-xl"}`}
        >
          {companyName}
        </div>
        <div
          className={`flex flex-col justify-center  gap-4 ${!compact && "justify-around gap-5 items-end"}`}
        >
          <div className="font-sm text-lg ">{title}</div>
          <div className="flex font-semibold text-xs items-center gap-2">
            <p>Suitability</p>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                size={14}
                key={index.toString()}
                className={
                  index <= +suitability_rate - 1
                    ? "fill-amber-400 text-amber-400"
                    : ""
                }
              />
            ))}
          </div>

          {!compact && (
            <>
              <div className="font-extralight ">
                {advertiser.first_name + " " + advertiser.last_name}
              </div>
              <div className="first-letter:text-2xl leading-loose ">
                {description}
              </div>
              <div className="flex flex-1 justify-end item-end">
                <Button
                  variant="secondary"
                  size={"md"}
                  className="flex gap-2 "
                  onClick={() => onClick(id) ?? null}
                >
                  <Send size={16} />
                  <span>Send</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
