"use client";
import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getFarmers, getProducts } from "@/lib/db";

export default function Farmers() {
  const { data } = useData(async () => ({ farmers: await getFarmers(), products: await getProducts() }));
  const [q, setQ] = useState("");
  const list = (data?.farmers || []).filter((f) => `${f.name} ${f.location} ${f.specialty}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Meet our farmers" subtitle="Real people, real farms. Every product on Farmora is sold directly by the people who grow it." crumbs={[{ label: "Farmers" }]} />
      <div className="container-x py-10">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by farm, location or specialty..." className="input mb-8 max-w-md" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => (
            <Link key={f.id} href={`/farmers/${f.id}`} className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <SafeImage src={f.cover} className="h-36 w-full object-cover" />
              <div className="-mt-10 p-5 pt-0">
                <SafeImage src={f.avatar} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow" />
                <h3 className="mt-2 text-lg font-bold">{f.name} {f.verified && <span title="Verified" className="text-brand-600">✔</span>}</h3>
                <p className="text-sm text-gray-500">by {f.owner} · 📍 {f.location}</p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{f.bio}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1"><Stars value={f.rating} size="text-xs" /> {f.rating} ({f.reviews})</span>
                  <span className="badge bg-brand-50 text-brand-700">{(data?.products || []).filter((p) => p.farmerId === f.id).length} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
