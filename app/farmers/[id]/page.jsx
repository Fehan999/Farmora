"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Avatar from "@/components/Avatar";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getFarmer, getProducts } from "@/lib/db";

export default function FarmerProfile() {
  const { id } = useParams();
  const { data } = useData(async () => ({ farmer: await getFarmer(id), products: (await getProducts()).filter((p) => p.farmerId === id) }), [id]);

  if (!data) return <div className="container-x py-24 text-center text-gray-500">Loading...</div>;
  const { farmer, products } = data;
  const photos = products.filter((p) => p.image);
  const cover = farmer?.cover || photos[0]?.image || "";
  if (!farmer) return <div className="container-x py-24 text-center"><h1 className="text-2xl font-bold">Farm not found</h1><Link href="/farmers" className="btn-primary mt-4">All farmers</Link></div>;

  return (
    <>
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 sm:h-80">
        {cover && <SafeImage src={cover} alt={`Fields and produce at ${farmer.name}`} priority sizes="100vw" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/30 to-transparent" />
        <div className="container-x absolute inset-x-0 top-6 text-xs text-white/80">
          <Link href="/" className="hover:text-white">Home</Link> / <Link href="/farmers" className="hover:text-white">Farmers</Link> / <span className="text-white">{farmer.name}</span>
        </div>
      </div>
      <div className="container-x">
        <div className="card -mt-20 relative flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <Avatar src={farmer.avatar} name={farmer.owner || farmer.name} sizes="128px" rounded="rounded-2xl" text="text-4xl" className="h-32 w-32 border-4 border-white shadow-lg" />
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
            {photos.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="mb-3 font-semibold">From the farm</h3>
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(0, 6).map((p) => (
                    <Link key={p.id} href={`/product/${p.id}`} title={p.name} className="group overflow-hidden rounded-xl">
                      <SafeImage src={p.image} alt={p.name} sizes="90px" className="aspect-square w-full object-cover transition duration-300 group-hover:scale-110" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
