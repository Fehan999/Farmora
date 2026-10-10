"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import useData from "@/components/useData";
import { getProducts } from "@/lib/db";
import { CATEGORIES } from "@/data/seed";

export default function Categories() {
  const { data: products } = useData(() => getProducts());
  return (
    <>
      <PageHeader title="Categories" subtitle="Explore the full harvest by aisle." crumbs={[{ label: "Categories" }]} />
      <div className="container-x grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group card relative overflow-hidden">
            <SafeImage src={c.image} alt={c.name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 p-5 text-white">
              <span className="text-3xl">{c.icon}</span>
              <h3 className="text-xl font-bold">{c.name}</h3>
              <p className="text-sm text-white/80">{(products || []).filter((p) => p.category === c.slug).length} products</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
