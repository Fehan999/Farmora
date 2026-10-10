export default function StatCard({ label, value, icon, hint, tone = "brand" }) {
  const tones = { brand: "bg-brand-50 text-brand-700", earth: "bg-earth-100 text-earth-600", blue: "bg-sky-50 text-sky-700", rose: "bg-rose-50 text-rose-700" };
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 place-items-center rounded-xl text-2xl ${tones[tone]}`}>{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    </div>
  );
}
