import { useState } from "react";
import Jobs from ".";
import { Modal } from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Dropdown from "../../components/ui/DropDown";
import { getCompanySearch } from "../../services/global.service";
import Button from "../../components/ui/Button";
import { Save } from "lucide-react";
import { createJob } from "../../services/job.service";
import { useForm, Controller } from "react-hook-form";
const CreateJob = () => {
  const onSubmit = async (data: JobFormInput) => {
    console.log("Payload:", data);
    const results = await createJob(data);
    console.log(results);
  };
  interface JobFormInput {
    title: string;
    suitability_rate: number | string;
    description: string;
    company_id: [];
  }
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobFormInput>({
    defaultValues: {
      title: "",
      suitability_rate: 1,
      description: "",
      company_id: [],
    },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 space-y-4">
          <Input
            label="Title"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          <Input
            label="Suitability Rate"
            type="number"
            {...register("suitability_rate", {
              valueAsNumber: true,
              min: { value: 1, message: "Minimum 1" },
              max: { value: 5, message: "Maximum 5" },
            })}
            error={errors.suitability_rate?.message}
          />
        </div>

        <div className="flex-1 space-y-4">
          <Input label="Description" type="text" {...register("description")} />

          {/* Custom Dropdown Bileşeni için Controller Kullanımı */}
          <Controller
            name="company_id"
            control={control}
            rules={{ required: "Company selection is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <Dropdown
                  label="Company"
                  value={value}
                  onChange={(selectedVal) => {
                    onChange(selectedVal);
                  }}
                  disable={value.length > 0}
                  handleQuery={async (query: string) => {
                    const results = await getCompanySearch(query);
                    return results;
                  }}
                />
                {error && (
                  <span className="text-xs text-red-500">{error.message}</span>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end items-center mt-20">
        <Button
          className="flex gap-4 bg-primary w-xs dark:border"
          type="submit"
          disabled={isSubmitting}
        >
          <Save size={16} />
          <span>{isSubmitting ? "Creating..." : "Create"}</span>
        </Button>
      </div>
    </form>
  );
};

export default function RecruiterJob() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <Modal
        title="Create Job"
        children={<CreateJob />}
        handleClose={() => setIsVisible((prev: boolean) => !prev)}
        isVisible={isVisible}
      />
      <Jobs isPermissonRecruiter handleCreateJob={() => setIsVisible(true)} />
    </div>
  );
}
