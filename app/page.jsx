"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Avatar from "@/components/Avatar";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getProducts, getFarmers } from "@/lib/db";
import { CATEGORIES, REVIEWS } from "@/data/seed";
import { SITE_IMAGES, PAGE_IMAGES } from "@/data/images";

const catImage = (slug) => CATEGORIES.find((c) => c.slug === slug)?.image || "";
const HERO_MAIN = SITE_IMAGES.heroMain || catImage("vegetables");
const HERO_SECOND = SITE_IMAGES.heroSecondary || catImage("fruits");
const HOW_IMAGE = PAGE_IMAGES.farmers || SITE_IMAGES.about || catImage("vegetables");
const SELL_IMAGE = SITE_IMAGES.sell || PAGE_IMAGES.farmers || catImage("vegetables");
const STEPS = [
  ["🧑‍🌾", "Farmers list", "Local farmers publish their fresh harvest with photos and prices."],
  ["🛒", "You shop", "Browse by farm or category and fill your basket."],
  ["📦", "Farm packs", "Your order is packed at the farm within hours."],
  ["🏡", "Delivered", "At your door in 3 days with live tracking."],
];

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
  const countOf = (slug) => products.filter((p) => p.category === slug).length;
  const imageOf = (c) => c.image || products.find((p) => p.category === c.slug && p.image)?.image || "";
  const coverOf = (f) => f.cover || products.find((p) => p.farmerId === f.id && p.image)?.image || "";

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
            <div className="relative mt-10 lg:hidden">
              <SafeImage src={HERO_MAIN} alt="Fresh vegetables from local farms" sizes="(max-width: 1024px) 92vw, 0px" className="h-56 w-full rounded-3xl object-cover shadow-2xl sm:h-72" />
              <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-gray-800 shadow-xl">
                <span className="text-2xl">🚚</span>
                <div><p className="text-sm font-bold">Delivered in 72 hours</p><p className="text-xs text-gray-500">Track every step live</p></div>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <SafeImage src={HERO_MAIN} alt="Fresh vegetables from local farms" priority sizes="(max-width: 1024px) 0px, 300px" className="h-80 w-full rounded-3xl object-cover shadow-2xl" />
              <SafeImage src={HERO_SECOND} alt="Farmer holding fresh harvest" priority sizes="(max-width: 1024px) 0px, 300px" className="mt-12 h-80 w-full rounded-3xl object-cover shadow-2xl" />
            </div>
            <div className="absolute -bottom-4 left-8 flex items-center gap-3 rounded-2xl bg-white p-4 text-gray-800 shadow-xl">
              <span className="text-3xl">🚚</span>
              <div><p className="text-sm font-bold">Delivered in 72 hours</p><p className="text-xs text-gray-500">Track every step live</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x -mt-8 relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["🌱", "Farm Fresh", "Harvested days, not weeks, ago"], ["🚚", "3-Day Delivery", "Live tracking on every order"], ["🤝", "Fair Trade", "Farmers keep 90% of each sale"], ["🔒", "Secure Checkout", "Card or cash on delivery"]].map(([i, t, d]) => (
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {CATEGORIES.map((c) => {
            const img = imageOf(c);
            return (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group relative isolate block aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:aspect-[4/3]">
                {img ? (
                  <SafeImage src={img} alt={`${c.name} from local farms`} sizes="(max-width: 768px) 46vw, (max-width: 1280px) 24vw, 300px" className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                ) : (
                  <span className="absolute inset-0 -z-10 grid place-items-center text-7xl opacity-40">{c.icon}</span>
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-xl shadow-md backdrop-blur transition group-hover:scale-110">{c.icon}</span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-semibold leading-tight drop-shadow sm:text-lg">{c.name}</h3>
                  <p className="mt-1 flex items-center justify-between text-xs text-white/80">
                    <span>{data ? `${countOf(c.slug)} items` : "Fresh picks"}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-sm backdrop-blur transition group-hover:translate-x-1 group-hover:bg-white group-hover:text-brand-800">→</span>
                  </p>
                </div>
              </Link>
            );
          })}
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
        <div className="grid items-center gap-10 lg:grid-cols-[5fr_7fr]">
          <div className="relative">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-xl">
              {HOW_IMAGE ? (
                <SafeImage src={HOW_IMAGE} alt="Fresh harvest on a Farmora partner farm" sizes="(max-width: 1024px) 92vw, 500px" className="h-72 w-full object-cover sm:h-96 lg:h-[30rem]" />
              ) : (
                <div className="grid h-72 place-items-center text-8xl sm:h-96 lg:h-[30rem]">🧑‍🌾</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-sm text-brand-100">Farm to door in</p>
                <p className="font-display text-4xl font-bold">72 hours</p>
              </div>
            </div>
            <div className="absolute -right-3 -top-4 hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl sm:flex">
              <span className="text-2xl">🤝</span>
              <div><p className="text-sm font-bold text-gray-800">Direct from farmers</p><p className="text-xs text-gray-500">No middlemen, fair prices</p></div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-earth-600">Simple & transparent</p>
            <h2 className="font-display text-3xl font-bold text-brand-900">How Farmora works</h2>
            <p className="mt-2 max-w-xl text-gray-500">From the field to your kitchen in four simple steps, with every order tracked live along the way.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {STEPS.map(([i, t, d], idx) => (
                <div key={t} className="card relative p-6">
                  <span className="absolute right-4 top-3 text-5xl font-bold text-brand-50">{idx + 1}</span>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl">{i}</span>
                  <h3 className="mt-4 font-semibold">{t}</h3>
                  <p className="mt-1 text-sm text-gray-500">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="font-semibold text-earth-600">Meet the growers</p><h2 className="font-display text-3xl font-bold text-brand-900">Our partner farms</h2></div>
          <Link href="/farmers" className="text-sm font-semibold text-brand-700 hover:underline">All farmers →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {farmers.slice(0, 4).map((f) => (
            <Link key={f.id} href={`/farmers/${f.id}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <div className="h-28 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
                {coverOf(f) && <SafeImage src={coverOf(f)} alt={`Fields and produce at ${f.name}`} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 300px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="relative -mt-8 px-5 pb-5">
                <Avatar src={f.avatar} name={f.owner} sizes="64px" text="text-lg" className="h-16 w-16 border-4 border-white shadow" />
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
                  <Avatar src={r.avatar} name={r.name} sizes="40px" className="h-10 w-10" />
                  <p className="text-sm font-semibold">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand-800 text-white">
          {SELL_IMAGE && <SafeImage src={SELL_IMAGE} alt="Farmer tending crops in the field" sizes="(max-width: 1280px) 100vw, 1216px" className="absolute inset-0 -z-10 h-full w-full object-cover" />}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/95 via-brand-900/80 to-brand-800/40" />
          <div className="flex flex-col items-start justify-between gap-6 p-8 sm:p-12 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="badge bg-white/15 px-3 py-1 text-brand-50">🧑‍🌾 For growers</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Are you a farmer?</h2>
              <p className="mt-2 text-brand-100">Open your digital farm stand in minutes and reach thousands of local buyers.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register?role=farmer" className="btn bg-earth-500 px-8 py-3 text-white hover:bg-earth-600">Start selling</Link>
              <Link href="/sell" className="btn border border-white/40 px-6 py-3 text-white hover:bg-white/10">Learn more</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
