import Link from "next/link";
import SafeImage from "./SafeImage";

function Crumbs({ crumbs, dark }) {
  const link = dark ? "hover:text-white" : "hover:text-brand-700";
  return (
    <nav aria-label="Breadcrumb" className={`mb-2 text-xs ${dark ? "text-brand-100/80" : "text-gray-500"}`}>
      <Link href="/" className={link}>Home</Link>
      {crumbs.map((c) => (
        <span key={c.label}> / {c.href ? <Link href={c.href} className={link}>{c.label}</Link> : <span className={dark ? "text-white" : ""}>{c.label}</span>}</span>
      ))}
    </nav>
  );
}

export default function PageHeader({ title, subtitle, crumbs = [], image, imageAlt }) {
  if (image === undefined) {
    return (
      <section className="border-b border-brand-100 bg-gradient-to-br from-brand-50 to-earth-50">
        <div className="container-x py-10">
          <Crumbs crumbs={crumbs} />
          <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-gray-600">{subtitle}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
      {image ? (
        <SafeImage src={image} alt={imageAlt || title} priority sizes="100vw" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      ) : (
        <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/95 via-brand-900/75 to-brand-800/30" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-brand-900/50 to-transparent" />
      <div className="container-x py-14 sm:py-20">
        <Crumbs crumbs={crumbs} dark />
        <h1 className="max-w-3xl font-display text-3xl font-bold drop-shadow-sm sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-brand-50/90 sm:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
