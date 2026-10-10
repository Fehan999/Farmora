"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getFarmer, getProducts } from "@/lib/db";

export default function FarmerProfile() {
  const { id } = useParams();
  const { data } = useData(async () => ({ farmer: await getFarmer(id), products: (await getProducts()).filter((p) => p.farmerId === id) }), [id]);

  if (!data) return <div className="container-x py-24 text-center text-gray-500">Loading...</div>;
  const { farmer, products } = data;
  if (!farmer) return <div className="container-x py-24 text-center"><h1 className="text-2xl font-bold">Farm not found</h1><Link href="/farmers" className="btn-primary mt-4">All farmers</Link></div>;

  return (
    <>
      <div className="relative h-64 bg-brand-800">
        <SafeImage src={farmer.cover} className="h-full w-full object-cover opacity-70" />
      </div>
      <div className="container-x">
        <div className="card -mt-20 relative flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <SafeImage src={farmer.avatar} className="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-lg" />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-brand-900">{farmer.name} {farmer.verified && <span className="badge bg-brand-600 align-middle text-white">✔ Verified</span>}</h1>
            <p className="mt-1 text-gray-500">Run by {farmer.owner} · 📍 {farmer.location} · Farming since {farmer.since}</p>
            <div className="mt-2 flex items-center gap-2 text-sm"><Stars value={farmer.rating} /> {farmer.rating} ({farmer.reviews} reviews)</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {farmer.certifications.map((c) => <span key={c} className="badge bg-earth-100 text-earth-600">🏅 {c}</span>)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[[products.length, "Products"], [farmer.acres, "Acres"], [new Date().getFullYear() - farmer.since, "Years"]].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-brand-50 px-4 py-3"><p className="text-2xl font-bold text-brand-700">{v}</p><p className="text-xs text-gray-500">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="card h-fit space-y-4 p-6 text-sm">
            <h2 className="text-lg font-semibold">About the farm</h2>
            <p className="text-gray-600">{farmer.bio}</p>
            <p><b>Specialty:</b> {farmer.specialty}</p>
            <p><b>Email:</b> {farmer.email}</p>
            {farmer.phone && <p><b>Phone:</b> {farmer.phone}</p>}
            <Link href="/contact" className="btn-outline w-full">Message farmer</Link>
          </aside>
          <div>
            <h2 className="mb-5 font-display text-2xl font-bold text-brand-900">Products from {farmer.name}</h2>
            {products.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{products.map((p) => <ProductCard key={p.id} product={p} farmer={farmer} />)}</div>
            ) : <p className="text-gray-500">This farm hasn't listed products yet.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
