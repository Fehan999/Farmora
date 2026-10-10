"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import SafeImage from "@/components/SafeImage";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getProducts, getFarmers, getProductReviews, addReview } from "@/lib/db";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES, REVIEWS } from "@/data/seed";
import { money, date, SHIPPING_FREE_OVER, SHIPPING_FEE } from "@/lib/format";

const isLive = (p) => p.status !== "rejected" && p.status !== "hidden";
const arrivalDate = () => new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

function Skeleton() {
  return (
    <div className="container-x animate-pulse py-10" aria-busy="true" aria-label="Loading product">
      <div className="mb-6 h-3 w-64 max-w-full rounded bg-gray-200" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/3] rounded-3xl bg-gray-200" />
          <div className="mt-3 flex gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-[72px] w-24 rounded-xl bg-gray-200" />)}</div>
        </div>
        <div className="space-y-4">
          <div className="h-5 w-40 rounded-full bg-gray-200" />
          <div className="h-10 w-3/4 rounded-lg bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-32 rounded-2xl bg-gray-200" />
          <div className="h-16 rounded-lg bg-gray-200" />
          <div className="h-12 rounded-full bg-gray-200" />
          <div className="h-12 rounded-full bg-gray-200" />
          <div className="h-24 rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function ProductRow({ title, subtitle, href, items, farmers }) {
  if (!items.length) return null;
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {href && <Link href={href} className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">View all →</Link>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} farmer={farmers.find((f) => f.id === p.farmerId)} />)}
      </div>
    </section>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, wishlist, finalPrice, addRecent, recent, toast, cartTotal } = useShop();
  const { data } = useData(async () => {
    const [products, farmers, reviews] = await Promise.all([getProducts({ includeHidden: true }), getFarmers(), getProductReviews(id)]);
    return { products, farmers, reviews };
  }, [id]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, text: "" });
  const [showBar, setShowBar] = useState(false);
  const [arrival, setArrival] = useState("");
  const buyRef = useRef(null);
  const tabsRef = useRef(null);
  const product = data?.products.find((p) => p.id === id);

  useEffect(() => { if (data) setReviews(data.reviews); }, [data]);
  useEffect(() => { addRecent(id); setQty(1); setTab("description"); }, [id, addRecent]);
  useEffect(() => { setArrival(arrivalDate()); }, []);
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [product?.id]);

  if (!data) return <Skeleton />;

  const live = data.products.filter(isLive);

  if (!product) {
    return (
      <div className="container-x py-20">
        <div className="text-center">
          <div className="text-6xl">🧺</div>
          <h1 className="mt-4 font-display text-3xl font-bold text-brand-900">Product not found</h1>
          <p className="mt-2 text-gray-500">This item may be out of season or was removed by the farmer.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-primary">Browse the shop</Link>
            <Link href="/categories" className="btn-outline">View categories</Link>
          </div>
        </div>
        <ProductRow title="Best sellers on Farmora" href="/shop?sort=popular" items={[...live].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4)} farmers={data.farmers} />
      </div>
    );
  }

  const farmer = data.farmers.find((f) => f.id === product.farmerId);
  const category = CATEGORIES.find((c) => c.slug === product.category);
  const others = live.filter((p) => p.id !== product.id);
  const related = others.filter((p) => p.category === product.category).slice(0, 4);
  const bestSellers = [...others].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4);
  const recentItems = recent.filter((r) => r !== product.id).map((r) => live.find((p) => p.id === r)).filter(Boolean).slice(0, 4);
  const gallery = [...new Set([product.image, ...(product.gallery || [])].filter(Boolean))];
  const price = finalPrice(product);
  const savings = product.price - price;
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock < 20;
  const stockPct = soldOut ? 0 : Math.max(6, Math.min(100, Math.round((product.stock / 150) * 100)));
  const saved = wishlist.includes(product.id);
  const freeLeft = Math.max(0, SHIPPING_FREE_OVER - cartTotal);
  const sampleReviews = REVIEWS.slice(0, 3).map((r, i) => ({ ...r, id: `s${i}`, createdAt: new Date(Date.now() - (i + 2) * 864e5 * 5).toISOString() }));
  const ownReviews = reviews.filter((r) => !r.productId || r.productId === product.id);
  const allReviews = [...ownReviews, ...sampleReviews];
  const highlights = [
    product.organic ? ["🌱", "Certified organic", "Grown without synthetic pesticides or fertilisers."] : ["🌾", "Responsibly grown", "Raised with sustainable, low-input farming practices."],
    farmer && ["🏡", `Straight from ${farmer.name}`, `${farmer.location ? `Produced in ${farmer.location}` : "Produced on a local family farm"}${farmer.since ? `, farming since ${farmer.since}` : ""}.`],
    ["✂️", "Harvested to order", "Picked or prepared after you order and packed within 6 hours."],
    ["📦", product.unit === "each" ? "Sold individually" : `Sold per ${product.unit}`, "Hand-packed in insulated, recyclable packaging to stay fresh in transit."],
    farmer?.certifications?.length > 0 && ["🏅", "Certified quality", farmer.certifications.join(" · ")],
  ].filter(Boolean);

  function add() {
    addToCart(product, qty);
  }

  function buyNow() {
    addToCart(product, qty);
    router.push("/checkout");
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: `${product.name} from ${farmer?.name || "Farmora"}`, url }); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    } catch {
      toast("Could not copy the link", "error");
    }
  }

  function openReviews() {
    setTab("reviews");
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!form.text.trim()) return;
    const r = await addReview({ productId: id, rating: form.rating, text: form.text, name: user?.name || "Guest", avatar: `https://i.pravatar.cc/100?u=${user?.uid || "guest"}` });
    setReviews((list) => [r, ...list]);
    setForm({ rating: 5, text: "" });
    toast("Thanks for your review!");
  }

  return (
    <div className="container-x pb-28 pt-8 lg:pb-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link><span>/</span>
        <Link href="/shop" className="hover:text-brand-700">Shop</Link><span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-700">{category?.name || "Products"}</Link><span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      {!isLive(product) && <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">This listing is not currently visible in the shop.</div>}

      <div className="grid gap-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <ProductGallery key={product.id} images={gallery} alt={product.name} fallbackSrc={category?.image} discount={product.discount} organic={product.organic} soldOut={soldOut} bestSeller={product.sold > 700} />

        <div className="lg:row-span-2">
          <div className="flex flex-wrap gap-2">
            <Link href={`/shop?category=${product.category}`} className="badge bg-gray-100 text-gray-600 hover:bg-gray-200">{category?.icon} {category?.name || product.category}</Link>
            {product.organic && <span className="badge bg-brand-100 text-brand-700">🌱 Organic</span>}
            {product.sold > 700 && <span className="badge bg-amber-100 text-amber-800">★ Best seller</span>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-brand-900 sm:text-4xl">{product.name}</h1>
          {farmer && <p className="mt-1 text-sm text-gray-500">by <Link href={`/farmers/${farmer.id}`} className="font-medium text-earth-600 hover:underline">{farmer.name}</Link>{farmer.verified && <span className="ml-1 text-brand-600" title="Verified farm">✔</span>}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
            <Stars value={product.rating} />
            <span className="font-semibold text-gray-800">{product.rating}</span>
            <button type="button" onClick={openReviews} className="hover:text-brand-700 hover:underline">({product.reviewsCount + ownReviews.length} reviews)</button>
            <span>·</span>
            <span>{product.sold} sold</span>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="text-4xl font-bold text-brand-700">{money(price)}</span>
              <span className="pb-1 text-gray-500">/ {product.unit}</span>
              {product.discount > 0 && <span className="pb-1 text-lg text-gray-400 line-through">{money(product.price)}</span>}
            </div>
            {savings > 0 && (
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
                <span className="badge bg-red-100 text-red-600">-{product.discount}%</span> You save {money(savings)} per {product.unit}
              </p>
            )}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-semibold ${soldOut ? "text-red-600" : lowStock ? "text-amber-600" : "text-brand-600"}`}>
                  {soldOut ? "Out of stock" : lowStock ? `Only ${product.stock} left — order soon` : "✔ In stock"}
                </span>
                {!soldOut && <span className="text-xs text-gray-400">{product.stock} available</span>}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-label="Remaining stock" aria-valuemin={0} aria-valuemax={100} aria-valuenow={stockPct}>
                <div className={`h-full rounded-full transition-all ${soldOut ? "bg-red-500" : lowStock ? "bg-amber-500" : "bg-brand-500"}`} style={{ width: `${stockPct}%` }} />
              </div>
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-gray-600">{product.description}</p>

          <div ref={buyRef} className="mt-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-gray-200 bg-white">
                <button type="button" aria-label="Decrease quantity" disabled={soldOut || qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-lg disabled:text-gray-300">−</button>
                <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
                <button type="button" aria-label="Increase quantity" disabled={soldOut || qty >= product.stock} onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-4 py-2.5 text-lg disabled:text-gray-300">+</button>
              </div>
              <button type="button" disabled={soldOut} onClick={add} className="btn-primary flex-1 py-3">{soldOut ? "Out of stock" : `Add to cart · ${money(price * qty)}`}</button>
            </div>
            <div className="flex gap-3">
              <button type="button" disabled={soldOut} onClick={buyNow} className="btn flex-1 bg-brand-900 py-3 text-white shadow-sm hover:bg-brand-800">Buy now</button>
              <button type="button" onClick={() => toggleWishlist(product)} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                className={`btn border px-4 py-3 ${saved ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
                <span className="text-lg leading-none">{saved ? "♥" : "♡"}</span><span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
              </button>
              <button type="button" onClick={share} aria-label="Share this product" className="btn border border-gray-200 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50">
                <span className="text-lg leading-none">↗</span><span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="animate-truck text-xl">🚚</span>
              <div>
                <p className="font-semibold text-brand-900">Order now — arrives {arrival ? `by ${arrival}` : "in 3 days"}</p>
                <p className="text-gray-600">Packed at {farmer?.name || "the farm"} and shipped in temperature-controlled packaging.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🎁</span>
              <p className="text-gray-600">
                {freeLeft > 0
                  ? <>Free delivery on orders over {money(SHIPPING_FREE_OVER)}. Add <span className="font-semibold text-brand-800">{money(freeLeft)}</span> more to your cart to qualify, otherwise a flat {money(SHIPPING_FEE)} applies.</>
                  : <>Your cart qualifies for <span className="font-semibold text-brand-800">free delivery</span>.</>}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            {[["🌿", "Freshness guarantee", "Not fresh? Full refund"], ["⏱️", "3-day delivery", "Farm to door in 72h"], ["🔒", "Secure checkout", "Encrypted payments"]].map(([icon, title, sub]) => (
              <div key={title} className="rounded-xl border border-gray-100 bg-white p-3">
                <div className="text-xl">{icon}</div>
                <p className="mt-1 font-semibold text-brand-800">{title}</p>
                <p className="mt-0.5 hidden text-gray-500 sm:block">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-brand-900">Why you&apos;ll love it</h2>
            <ul className="mt-4 space-y-4">
              {highlights.map(([icon, title, text]) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-lg">{icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-500">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {farmer && (
            <div className="card p-6">
              <div className="flex items-center gap-4">
                <SafeImage src={farmer.avatar} alt={farmer.name} sizes="64px" className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-brand-50" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Sold by</p>
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">
                    {farmer.name}
                    {farmer.verified && <span className="badge bg-brand-100 text-brand-700">✔ Verified</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {farmer.location && <>📍 {farmer.location} · </>}
                    {farmer.rating ? <><span className="text-amber-400">★</span> {farmer.rating}{farmer.reviews ? ` (${farmer.reviews} reviews)` : ""}</> : "New on Farmora"}
                  </p>
                </div>
              </div>
              {farmer.bio && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{farmer.bio}</p>}
              <Link href={`/farmers/${farmer.id}`} className="btn-outline mt-4 w-full">Visit the farm →</Link>
            </div>
          )}
        </div>
      </div>

      <div ref={tabsRef} className="mt-14 scroll-mt-24">
        <div className="flex gap-2 overflow-x-auto border-b" role="tablist">
          {["description", "reviews", "delivery"].map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t}{t === "reviews" && ` (${allReviews.length})`}
            </button>
          ))}
        </div>
        <div className="py-6">
          {tab === "description" && (
            <div className="grid gap-6 md:grid-cols-2">
              <p className="leading-relaxed text-gray-600">{product.description} Every batch is inspected by the farmer before packing and travels in insulated, recyclable packaging.</p>
              <table className="text-sm">
                <tbody className="divide-y">
                  {[["Unit", product.unit], ["Category", category?.name], ["Organic", product.organic ? "Yes" : "No"], ["Farm", farmer?.name], ["Origin", farmer?.location], ["Storage", "Keep refrigerated / cool, dry place"]].map(([k, v]) => (
                    <tr key={k}><td className="py-2 pr-6 font-medium text-gray-500">{k}</td><td className="py-2">{v || "—"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "reviews" && (
            <div className="grid gap-8 md:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {allReviews.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center gap-3">
                      <SafeImage src={r.avatar} alt={r.name} sizes="40px" className="h-10 w-10 rounded-full object-cover" />
                      <div><p className="text-sm font-semibold">{r.name}</p><p className="text-xs text-gray-400">{date(r.createdAt)}</p></div>
                      <span className="ml-auto"><Stars value={r.rating} /></span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{r.text}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="card flex items-center gap-4 p-5">
                  <span className="text-4xl font-bold text-brand-900">{product.rating}</span>
                  <div>
                    <Stars value={product.rating} />
                    <p className="text-xs text-gray-500">Based on {product.reviewsCount + ownReviews.length} reviews</p>
                  </div>
                </div>
                <form onSubmit={submitReview} className="card h-fit space-y-3 p-5">
                  <h3 className="font-semibold">Write a review</h3>
                  <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button type="button" key={i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => setForm({ ...form, rating: i })} className={i <= form.rating ? "text-amber-400" : "text-gray-300"}>★</button>
                    ))}
                  </div>
                  <textarea className="input h-28" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="How was it?" />
                  <button className="btn-primary w-full">Submit review</button>
                </form>
              </div>
            </div>
          )}
          {tab === "delivery" && (
            <div className="max-w-2xl space-y-3 text-sm text-gray-600">
              <p>📦 Orders are packed at the farm within 6 hours of purchase.</p>
              <p>🚚 Shipped within 24 hours in temperature-controlled packaging.</p>
              <p>🏡 Delivered to your door within 72 hours, with a live tracker on your order page.</p>
              <p>💚 Free delivery on orders over {money(SHIPPING_FREE_OVER)}. A flat {money(SHIPPING_FEE)} fee applies otherwise.</p>
            </div>
          )}
        </div>
      </div>

      <ProductRow title="You may also like" subtitle={`More fresh ${category?.name?.toLowerCase() || "picks"} from local farms`} href={`/shop?category=${product.category}`} items={related} farmers={data.farmers} />
      <ProductRow title="Best sellers on Farmora" subtitle="What shoppers are loving right now" href="/shop?sort=popular" items={bestSellers} farmers={data.farmers} />
      <ProductRow title="Recently viewed" items={recentItems} farmers={data.farmers} />

      <div aria-hidden={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <SafeImage src={product.image} alt="" sizes="48px" fallbackSrc={category?.image} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm font-bold text-brand-700">{money(price)} <span className="text-xs font-normal text-gray-500">/ {product.unit}</span>{product.discount > 0 && <span className="ml-1 text-xs font-normal text-gray-400 line-through">{money(product.price)}</span>}</p>
          </div>
          <button type="button" tabIndex={showBar ? 0 : -1} onClick={() => toggleWishlist(product)} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gray-200 text-lg ${saved ? "text-red-500" : "text-gray-500"}`}>{saved ? "♥" : "♡"}</button>
          <button type="button" tabIndex={showBar ? 0 : -1} disabled={soldOut} onClick={add} className="btn-primary shrink-0 py-3">{soldOut ? "Sold out" : "Add to cart"}</button>
        </div>
      </div>
    </div>
  );
}
