"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import useData from "@/components/useData";
import { getProducts } from "@/lib/db";
import { CATEGORIES } from "@/data/seed";
import { PAGE_IMAGES } from "@/data/images";

export default function Categories() {
  const { data: products } = useData(() => getProducts());
  const inCat = (slug) => (products || []).filter((p) => p.category === slug);
  return (
    <>
      <PageHeader title="Categories" subtitle="Explore the full harvest by aisle." crumbs={[{ label: "Categories" }]} image={PAGE_IMAGES.categories} imageAlt="Colourful seasonal fruit from local orchards" />
      <div className="container-x grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const items = inCat(c.slug);
          const thumbs = items.filter((p) => p.image).slice(0, 3);
          const img = c.image || thumbs[0]?.image || "";
          return (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group card relative isolate block h-64 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-800 transition hover:-translate-y-1 hover:shadow-xl">
              {img ? (
                <SafeImage src={img} alt={`${c.name} from local farms`} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 300px" className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              ) : (
                <span className="absolute inset-0 -z-10 grid place-items-center text-8xl opacity-40">{c.icon}</span>
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-2xl shadow-md">{c.icon}</span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                <div>
                  <h3 className="text-xl font-bold drop-shadow">{c.name}</h3>
                  <p className="text-sm text-white/80">{items.length} products</p>
                </div>
                {thumbs.length > 0 && (
                  <div className="flex -space-x-3">
                    {thumbs.map((p) => <SafeImage key={p.id} src={p.image} alt={p.name} sizes="36px" className="h-9 w-9 rounded-full border-2 border-white object-cover" />)}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
