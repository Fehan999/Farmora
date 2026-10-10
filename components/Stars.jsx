export default function Stars({ value = 0, size = "text-sm" }) {
  return (
    <span className={`${size} tracking-tight text-amber-400`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? "" : "text-gray-300"}>★</span>
      ))}
    </span>
  );
}
