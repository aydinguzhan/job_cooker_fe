export default function ReferencesSection({ references }) {
  return (
    <section className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Referanslar</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        {references.map((ref) => (
          <div key={ref.email} className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold">{ref.name}</h3>
            <p className="text-sm text-blue-600">{ref.email}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
