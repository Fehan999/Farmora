"use client";
import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Spinner from "@/components/Spinner";
import useData from "@/components/useData";
import { useShop } from "@/context/ShopContext";
import { getProducts, getFarmers } from "@/lib/db";
import { CATEGORIES } from "@/data/seed";
import { PAGE_IMAGES } from "@/data/images";

const PER_PAGE = 12;
const MIN_PRICE_CAP = 30;

function Shop() {
  const params = useSearchParams();
  const { finalPrice } = useShop();
  const { data } = useData(async () => {
    const [products, farmers] = await Promise.all([getProducts(), getFarmers()]);
    return { products, farmers };
  });
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [farmer, setFarmer] = useState("all");
  const [sort, setSort] = useState(params.get("sort") || "popular");
  const [maxPrice, setMaxPrice] = useState(null);
  const [organic, setOrganic] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQ(params.get("q") || "");
    setCategory(params.get("category") || "all");
    if (params.get("sort")) setSort(params.get("sort"));
  }, [params]);
  useEffect(() => setPage(1), [q, category, farmer, sort, maxPrice, organic, inStock]);

  const farmers = data?.farmers || [];
  const priceCap = useMemo(() => {
    const top = (data?.products || []).reduce((m, p) => Math.max(m, finalPrice(p) || 0), 0);
    return Math.max(MIN_PRICE_CAP, Math.ceil(top));
  }, [data]);
  const priceLimit = maxPrice === null || maxPrice >= priceCap ? Infinity : maxPrice;
  const list = useMemo(() => {
    const l = (data?.products || []).filter((p) =>
      (category === "all" || p.category === category) &&
      (farmer === "all" || p.farmerId === farmer) &&
      finalPrice(p) <= priceLimit &&
      (!organic || p.organic) &&
      (!inStock || p.stock > 0) &&
      (!q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase()))
    );
    const sorters = {
      popular: (a, b) => b.sold - a.sold,
      rating: (a, b) => b.rating - a.rating,
      low: (a, b) => finalPrice(a) - finalPrice(b),
      high: (a, b) => finalPrice(b) - finalPrice(a),
      discount: (a, b) => (b.discount || 0) - (a.discount || 0),
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    };
    return [...l].sort(sorters[sort] || sorters.popular);
  }, [data, q, category, farmer, sort, priceLimit, organic, inStock]);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const reset = () => { setQ(""); setCategory("all"); setFarmer("all"); setMaxPrice(null); setOrganic(false); setInStock(false); };

  return (
    <>
      <PageHeader title="Shop fresh" subtitle="Everything below was grown, raised or baked by independent farms." crumbs={[{ label: "Shop" }]} image={PAGE_IMAGES.shop} imageAlt="Freshly harvested vegetables at a local farm" />
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside>
          <div className="card space-y-5 p-5 lg:sticky lg:top-28">
            <div>
              <label className="label">Search</label>
              <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. apples" />
            </div>
            <div>
              <label className="label">Category</label>
              <div className="space-y-1">
                {[{ slug: "all", name: "All products", icon: "🧺" }, ...CATEGORIES].map((c) => (
                  <button key={c.slug} onClick={() => setCategory(c.slug)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm ${category === c.slug ? "bg-brand-600 text-white" : "hover:bg-gray-50"}`}>
                    {c.image
                      ? <SafeImage src={c.image} alt={c.name} sizes="28px" className="h-7 w-7 shrink-0 rounded-md object-cover" />
                      : <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 text-base">{c.icon}</span>}
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Farm</label>
              <select className="input" value={farmer} onChange={(e) => setFarmer(e.target.value)}>
                <option value="all">All farms</option>
                {farmers.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="shop-max-price">Max price: {priceLimit === Infinity ? "Any price" : `$${priceLimit}`}</label>
              <input id="shop-max-price" type="range" min="1" max={priceCap} value={priceLimit === Infinity ? priceCap : priceLimit} onChange={(e) => setMaxPrice(+e.target.value >= priceCap ? null : +e.target.value)} className="w-full accent-brand-600" />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={organic} onChange={(e) => setOrganic(e.target.checked)} className="accent-brand-600" /> Organic only</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-brand-600" /> In stock</label>
            <button onClick={reset} className="btn-outline w-full">Reset filters</button>
          </div>
        </aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">Showing <b>{shown.length}</b> of <b>{list.length}</b> products</p>
            <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="newest">Newest</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="discount">Biggest discount</option>
            </select>
          </div>
          {!data ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-80 animate-pulse bg-gray-100" />)}</div>
          ) : list.length === 0 ? (
            <div className="card py-20 text-center"><div className="text-5xl">🥕</div><p className="mt-3 font-semibold">No products match your filters</p><button onClick={reset} className="btn-primary mt-4">Clear filters</button></div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => <ProductCard key={p.id} product={p} farmer={farmers.find((f) => f.id === p.farmerId)} />)}
            </div>
          )}
          {pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`h-10 w-10 rounded-full text-sm font-semibold ${page === i + 1 ? "bg-brand-600 text-white" : "bg-white shadow-sm hover:bg-brand-50"}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<div className="container-x grid min-h-[60vh] place-items-center py-20"><Spinner label="Loading the shop..." /></div>}><Shop /></Suspense>;
}
