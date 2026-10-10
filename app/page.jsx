"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getProducts, getFarmers } from "@/lib/db";
import { CATEGORIES, REVIEWS } from "@/data/seed";
import { SITE_IMAGES } from "@/data/images";

export default function Home() {
  const { data } = useData(async () => {
    const [products, farmers] = await Promise.all([getProducts(), getFarmers()]);
    return { products, farmers };
  });
  const products = data?.products || [];
  const farmers = data?.farmers || [];
  const farmerOf = (id) => farmers.find((f) => f.id === id);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const deals = products.filter((p) => p.discount > 0).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="badge bg-white/15 px-3 py-1 text-brand-50">🌿 100% farm-fresh · 3-day delivery</span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-6xl">From Local Farms<br /><span className="text-earth-400">to Your Door.</span></h1>
            <p className="mt-5 max-w-lg text-lg text-brand-100">Shop seasonal produce, dairy, bread and more directly from independent farmers near you. Fair prices for growers, fresher food for you.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn bg-white px-7 py-3 text-brand-800 hover:bg-brand-50">Shop now →</Link>
              <Link href="/sell" className="btn border border-white/40 px-7 py-3 text-white hover:bg-white/10">Become a seller</Link>
            </div>
            <div className="mt-10 flex gap-8">
              {[["8+", "Partner farms"], ["40+", "Fresh products"], ["2.5k", "Happy families"]].map(([n, l]) => (
                <div key={l}><p className="text-3xl font-bold">{n}</p><p className="text-sm text-brand-200">{l}</p></div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <SafeImage src={SITE_IMAGES.heroMain} alt="Fresh vegetables from local farms" priority sizes="(max-width: 1024px) 0px, 300px" className="h-80 w-full rounded-3xl object-cover shadow-2xl" />
              <SafeImage src={SITE_IMAGES.heroSecondary} alt="Farmer holding fresh harvest" priority sizes="(max-width: 1024px) 0px, 300px" className="mt-12 h-80 w-full rounded-3xl object-cover shadow-2xl" />
            </div>
            <div className="absolute -bottom-4 left-8 flex items-center gap-3 rounded-2xl bg-white p-4 text-gray-800 shadow-xl">
              <span className="text-3xl">🚚</span>
              <div><p className="text-sm font-bold">Delivered in 72 hours</p><p className="text-xs text-gray-500">Track every step live</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x -mt-8 relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["🌱", "Farm Fresh", "Harvested days, not weeks, ago"], ["🚚", "3-Day Delivery", "Live tracking on every order"], ["🤝", "Fair Trade", "Farmers keep 85% of each sale"], ["🔒", "Secure Checkout", "Card or cash on delivery"]].map(([i, t, d]) => (
          <div key={t} className="card flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{i}</span>
            <div><p className="font-semibold">{t}</p><p className="text-xs text-gray-500">{d}</p></div>
          </div>
        ))}
      </section>

      <section className="container-x mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="font-semibold text-earth-600">Browse</p><h2 className="font-display text-3xl font-bold text-brand-900">Shop by category</h2></div>
          <Link href="/categories" className="text-sm font-semibold text-brand-700 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="card group flex flex-col items-center p-5 text-center transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
              <span className="text-4xl transition group-hover:scale-110">{c.icon}</span>
              <span className="mt-3 text-sm font-semibold">{c.name}</span>
              <span className="text-xs text-gray-400">{products.filter((p) => p.category === c.slug).length} items</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="font-semibold text-earth-600">Hand-picked</p><h2 className="font-display text-3xl font-bold text-brand-900">Featured this week</h2></div>
          <Link href="/shop" className="text-sm font-semibold text-brand-700 hover:underline">Shop all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} farmer={farmerOf(p.farmerId)} />)}
          {!data && Array.from({ length: 8 }).map((_, i) => <div key={i} className="card h-80 animate-pulse bg-gray-100" />)}
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="grid overflow-hidden rounded-3xl bg-earth-100 lg:grid-cols-2">
          <div className="p-10 lg:p-14">
            <span className="badge bg-earth-500 text-white">Limited time</span>
            <h2 className="mt-4 font-display text-4xl font-bold text-brand-900">Harvest deals up to 20% off</h2>
            <p className="mt-3 text-gray-600">Seasonal surplus straight from our farmers. Use code <b>FARMORA20</b> at checkout for an extra discount.</p>
            <Link href="/shop?sort=discount" className="btn-primary mt-6">Shop deals</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 p-6">
            {deals.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="relative overflow-hidden rounded-2xl bg-white">
                <SafeImage src={p.image} alt={p.name} sizes="(max-width: 1024px) 45vw, 300px" className="h-32 w-full object-cover" />
                <span className="badge absolute left-2 top-2 bg-red-500 text-white">-{p.discount}%</span>
                <p className="truncate px-3 py-2 text-sm font-semibold">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="text-center"><p className="font-semibold text-earth-600">Simple & transparent</p><h2 className="font-display text-3xl font-bold text-brand-900">How Farmora works</h2></div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[["🧑‍🌾", "Farmers list", "Local farmers publish their fresh harvest with photos and prices."], ["🛒", "You shop", "Browse by farm or category and fill your basket."], ["📦", "Farm packs", "Your order is packed at the farm within hours."], ["🏡", "Delivered", "At your door in 3 days with live tracking."]].map(([i, t, d], idx) => (
            <div key={t} className="card relative p-6 text-center">
              <span className="absolute right-4 top-3 text-5xl font-bold text-brand-50">{idx + 1}</span>
              <span className="text-5xl">{i}</span>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-gray-500">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="font-semibold text-earth-600">Meet the growers</p><h2 className="font-display text-3xl font-bold text-brand-900">Our partner farms</h2></div>
          <Link href="/farmers" className="text-sm font-semibold text-brand-700 hover:underline">All farmers →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {farmers.slice(0, 4).map((f) => (
            <Link key={f.id} href={`/farmers/${f.id}`} className="card overflow-hidden transition hover:shadow-lg">
              <SafeImage src={f.cover} alt={f.name} sizes="(max-width: 640px) 90vw, 300px" className="h-28 w-full object-cover" />
              <div className="-mt-8 px-5 pb-5">
                <SafeImage src={f.avatar} alt={f.owner} sizes="64px" className="h-16 w-16 rounded-full border-4 border-white object-cover" />
                <p className="mt-2 font-semibold">{f.name} {f.verified && <span className="text-brand-600">✔</span>}</p>
                <p className="text-xs text-gray-500">📍 {f.location}</p>
                <div className="mt-2 flex items-center gap-1 text-xs"><Stars value={f.rating} size="text-xs" /> {f.rating}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20 bg-brand-50 py-16">
        <div className="container-x">
          <h2 className="text-center font-display text-3xl font-bold text-brand-900">Loved by families</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {REVIEWS.slice(0, 3).map((r) => (
              <div key={r.name} className="card p-6">
                <Stars value={r.rating} />
                <p className="mt-3 text-gray-600">“{r.text}”</p>
                <div className="mt-4 flex items-center gap-3">
                  <SafeImage src={r.avatar} alt={r.name} sizes="40px" className="h-10 w-10 rounded-full object-cover" />
                  <p className="text-sm font-semibold">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-brand-800 p-10 text-white md:flex-row">
          <div>
            <h2 className="font-display text-3xl font-bold">Are you a farmer?</h2>
            <p className="mt-2 text-brand-100">Open your digital farm stand in minutes and reach thousands of local buyers.</p>
          </div>
          <Link href="/register?role=farmer" className="btn bg-earth-500 px-8 py-3 text-white hover:bg-earth-600">Start selling</Link>
        </div>
      </section>
    </>
  );
}
