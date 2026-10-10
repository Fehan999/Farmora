import Link from "next/link";

export default function PageHeader({ title, subtitle, crumbs = [] }) {
  return (
    <section className="border-b border-brand-100 bg-gradient-to-br from-brand-50 to-earth-50">
      <div className="container-x py-10">
        <nav className="mb-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}> / {c.href ? <Link href={c.href} className="hover:text-brand-700">{c.label}</Link> : c.label}</span>
          ))}
        </nav>
        <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-gray-600">{subtitle}</p>}
      </div>
    </section>
  );
}
