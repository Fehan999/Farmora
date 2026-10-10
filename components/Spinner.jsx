export default function Spinner({ size = 40, label, className = "" }) {
  const ring = Math.max(2, Math.round(size / 14));
  return (
    <span role="status" aria-live="polite" className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
        <span className="spinner-ring absolute inset-0 rounded-full border-brand-100 border-r-earth-400 border-t-brand-600" style={{ borderWidth: ring }} />
        <span aria-hidden="true" className="spinner-sprout block leading-none" style={{ fontSize: Math.round(size * 0.42) }}>🌱</span>
      </span>
      {label ? <span className="text-sm font-medium text-gray-500">{label}</span> : <span className="sr-only">Loading</span>}
    </span>
  );
}
