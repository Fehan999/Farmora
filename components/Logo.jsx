import Link from "next/link";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg text-white shadow">🌱</span>
      <span className={`font-display text-2xl font-bold tracking-tight ${light ? "text-white" : "text-brand-800"}`}>
        Farm<span className="text-earth-500">ora</span>
      </span>
    </Link>
  );
}
