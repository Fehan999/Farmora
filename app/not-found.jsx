import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <div className="text-7xl">🌾</div>
      <h1 className="mt-4 font-display text-5xl font-bold text-brand-900">404</h1>
      <p className="mt-2 text-gray-500">Looks like this field is empty. The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
