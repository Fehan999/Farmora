import PageHeader from "./PageHeader";
import { PAGE_IMAGES } from "@/data/images";

export default function LegalPage({ title, sections }) {
  return (
    <>
      <PageHeader title={title} subtitle="Last updated: October 2026" crumbs={[{ label: title }]} image={PAGE_IMAGES.legal} imageAlt="Rolling farmland at sunrise" />
      <div className="container-x max-w-3xl space-y-8 py-12">
        {sections.map(([h, p]) => (
          <section key={h}><h2 className="mb-2 text-xl font-semibold text-brand-900">{h}</h2><p className="leading-relaxed text-gray-600">{p}</p></section>
        ))}
      </div>
    </>
  );
}
