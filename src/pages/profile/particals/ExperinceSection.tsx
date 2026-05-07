
// 🔥 Timeline UX
export default function ExperienceSection({ experiences }) {
  return (
    <section className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-6">Deneyim</h2>

      <div className="relative border-l border-gray-200 pl-6 space-y-6">
        {experiences.map((exp, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full" />

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between flex-wrap gap-2">
                <h3 className="font-semibold">{exp.role}</h3>
                <span className="text-blue-600 text-sm">{exp.company}</span>
              </div>

              <p className="text-xs text-gray-500 mt-1">{exp.period}</p>
              <p className="text-sm mt-2">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
