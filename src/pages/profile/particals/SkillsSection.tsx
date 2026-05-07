import RatingStars from "../../../components/ui/RaitingStarts";

// type RefDataResponse = {
//   id: string;
//   name: string;
//   short_key: string;
// };

export default function SkillsSection({ skills }) {

  return (
    <section className="bg-white p-5 rounded-2xl shadow">
      <div className="flex flex-col gap-1 mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Yetenekler</h2>
          <p className="text-sm text-gray-500 mt-1">
            Teknik yeterlilikler ve kullanılan teknolojiler
          </p>
        </div>
        <span className="text-xs font-medium text-gray-500">
          {skills.length} yetenek
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2"
          >
            <span className="text-sm font-medium text-gray-800">
              {skill.name}
            </span>
            <RatingStars level={skill.level} />
          </div>
        ))}
      </div>
    </section>
  );
}
