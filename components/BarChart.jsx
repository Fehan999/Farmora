export default function BarChart({ data, format = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-56 items-end gap-2">
      {data.map((d) => (
        <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-500 opacity-0 transition group-hover:opacity-100">{format(d.value)}</span>
          <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all" style={{ height: `${(d.value / max) * 170 + 4}px` }} />
          <span className="text-[10px] text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
