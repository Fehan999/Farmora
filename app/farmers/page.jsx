"use client";
import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import Avatar from "@/components/Avatar";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getFarmers, getProducts } from "@/lib/db";
import { PAGE_IMAGES } from "@/data/images";

export default function Farmers() {
  const { data } = useData(async () => ({ farmers: await getFarmers(), products: await getProducts() }));
  const [q, setQ] = useState("");
  const productsOf = (id) => (data?.products || []).filter((p) => p.farmerId === id);
  const coverOf = (f) => f.cover || productsOf(f.id).find((p) => p.image)?.image || "";
  const list = (data?.farmers || []).filter((f) => `${f.name} ${f.location} ${f.specialty}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Meet our farmers" subtitle="Real people, real farms. Every product on Farmora is sold directly by the people who grow it." crumbs={[{ label: "Farmers" }]} image={PAGE_IMAGES.farmers} imageAlt="Rows of crops on a family-run partner farm" />
      <div className="container-x py-10">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by farm, location or specialty..." className="input mb-8 max-w-md" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => (
            <Link key={f.id} href={`/farmers/${f.id}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
                {coverOf(f) && <SafeImage src={coverOf(f)} alt={`Fields and produce at ${f.name}`} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                {f.specialty && <span className="badge absolute right-3 top-3 bg-white/90 text-brand-800 shadow">{f.specialty}</span>}
              </div>
              <div className="relative -mt-10 p-5 pt-0">
                <Avatar src={f.avatar} name={f.owner} sizes="80px" text="text-2xl" className="h-20 w-20 border-4 border-white shadow" />
                <h3 className="mt-2 text-lg font-bold">{f.name} {f.verified && <span title="Verified" className="text-brand-600">✔</span>}</h3>
                <p className="text-sm text-gray-500">by {f.owner} · 📍 {f.location}</p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{f.bio}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1"><Stars value={f.rating} size="text-xs" /> {f.rating} ({f.reviews})</span>
                  <span className="badge bg-brand-50 text-brand-700">{productsOf(f.id).length} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {data && list.length === 0 && (
          <div className="card py-16 text-center"><div className="text-5xl">🧑‍🌾</div><p className="mt-3 font-semibold">No farms match “{q}”</p><button onClick={() => setQ("")} className="btn-outline mt-4">Clear search</button></div>
        )}
      </div>
    </>
  );
}
