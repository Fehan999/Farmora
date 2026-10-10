"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Stars from "@/components/Stars";
import useData from "@/components/useData";
import { getProducts, getFarmers, getProductReviews, addReview } from "@/lib/db";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES, REVIEWS } from "@/data/seed";
import { money, date } from "@/lib/format";

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, wishlist, finalPrice, addRecent } = useShop();
  const { data } = useData(async () => {
    const [products, farmers, reviews] = await Promise.all([getProducts({ includeHidden: true }), getFarmers(), getProductReviews(id)]);
    return { products, farmers, reviews };
  }, [id]);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, text: "" });

  useEffect(() => { if (data) setReviews(data.reviews); }, [data]);
  useEffect(() => { addRecent(id); }, [id, addRecent]);

  if (!data) return <div className="container-x py-24 text-center text-gray-500">Loading product...</div>;
  const product = data.products.find((p) => p.id === id);
  if (!product) return <div className="container-x py-24 text-center"><h1 className="text-2xl font-bold">Product not found</h1><Link href="/shop" className="btn-primary mt-4">Back to shop</Link></div>;

  const farmer = data.farmers.find((f) => f.id === product.farmerId);
  const category = CATEGORIES.find((c) => c.slug === product.category);
  const related = data.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const price = finalPrice(product);
  const sampleReviews = REVIEWS.slice(0, 3).map((r, i) => ({ ...r, id: `s${i}`, createdAt: new Date(Date.now() - (i + 2) * 864e5 * 5).toISOString() }));
  const allReviews = [...reviews, ...sampleReviews];

  async function submitReview(e) {
    e.preventDefault();
    if (!form.text.trim()) return;
    const r = await addReview({ productId: id, rating: form.rating, text: form.text, name: user?.name || "Guest", avatar: `https://i.pravatar.cc/100?u=${user?.uid || "guest"}` });
    setReviews([r, ...reviews]);
    setForm({ rating: 5, text: "" });
  }

  return (
    <div className="container-x py-10">
      <nav className="mb-6 text-xs text-gray-500">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <Link href={`/shop?category=${product.category}`}>{category?.name}</Link> / <span className="text-gray-800">{product.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="card overflow-hidden"><SafeImage src={gallery[active]} alt={product.name} className="aspect-[4/3] w-full object-cover" /></div>
          <div className="mt-3 flex gap-3">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActive(i)} className={`overflow-hidden rounded-xl border-2 ${active === i ? "border-brand-600" : "border-transparent"}`}>
                <SafeImage src={g} className="h-20 w-24 object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {product.organic && <span className="badge bg-brand-100 text-brand-700">🌱 Organic</span>}
            {product.discount > 0 && <span className="badge bg-red-100 text-red-600">Save {product.discount}%</span>}
            <span className="badge bg-gray-100 text-gray-600">{category?.icon} {category?.name}</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-brand-900">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500"><Stars value={product.rating} /> {product.rating} · {product.reviewsCount + reviews.length} reviews · {product.sold} sold</div>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-4xl font-bold text-brand-700">{money(price)}</span>
            <span className="pb-1 text-gray-500">/ {product.unit}</span>
            {product.discount > 0 && <span className="pb-1 text-lg text-gray-400 line-through">{money(product.price)}</span>}
          </div>
          <p className="mt-5 leading-relaxed text-gray-600">{product.description}</p>
          <p className={`mt-4 text-sm font-semibold ${product.stock > 10 ? "text-brand-600" : product.stock > 0 ? "text-amber-600" : "text-red-600"}`}>
            {product.stock > 10 ? `✔ In stock (${product.stock} available)` : product.stock > 0 ? `Only ${product.stock} left!` : "Out of stock"}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-gray-200 bg-white">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 text-lg">−</button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2.5 text-lg">+</button>
            </div>
            <button disabled={product.stock <= 0} onClick={() => addToCart(product, qty)} className="btn-primary flex-1 py-3">Add to cart · {money(price * qty)}</button>
            <button onClick={() => toggleWishlist(product)} className="btn-outline py-3">{wishlist.includes(product.id) ? "♥ Saved" : "♡ Save"}</button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            {[["🚚", "Delivered in 3 days"], ["↩️", "Freshness guarantee"], ["🔒", "Secure payment"]].map(([i, t]) => (
              <div key={t} className="rounded-xl bg-brand-50 p-3"><div className="text-xl">{i}</div><p className="mt-1 font-medium text-brand-800">{t}</p></div>
            ))}
          </div>
          {farmer && (
            <Link href={`/farmers/${farmer.id}`} className="card mt-6 flex items-center gap-4 p-4 hover:shadow-md">
              <SafeImage src={farmer.avatar} className="h-14 w-14 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Sold by</p>
                <p className="font-semibold">{farmer.name} {farmer.verified && <span className="text-brand-600">✔</span>}</p>
                <p className="text-xs text-gray-500">📍 {farmer.location} · ⭐ {farmer.rating}</p>
              </div>
              <span className="text-sm font-semibold text-brand-700">Visit farm →</span>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-14">
        <div className="flex gap-2 border-b">
          {["description", "reviews", "delivery"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500"}`}>
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
                    <tr key={k}><td className="py-2 pr-6 font-medium text-gray-500">{k}</td><td className="py-2">{v}</td></tr>
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
                      <SafeImage src={r.avatar} className="h-10 w-10 rounded-full object-cover" />
                      <div><p className="text-sm font-semibold">{r.name}</p><p className="text-xs text-gray-400">{date(r.createdAt)}</p></div>
                      <span className="ml-auto"><Stars value={r.rating} /></span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{r.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={submitReview} className="card h-fit space-y-3 p-5">
                <h3 className="font-semibold">Write a review</h3>
                <div className="flex gap-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button type="button" key={i} onClick={() => setForm({ ...form, rating: i })} className={i <= form.rating ? "text-amber-400" : "text-gray-300"}>★</button>
                  ))}
                </div>
                <textarea className="input h-28" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="How was it?" />
                <button className="btn-primary w-full">Submit review</button>
              </form>
            </div>
          )}
          {tab === "delivery" && (
            <div className="max-w-2xl space-y-3 text-sm text-gray-600">
              <p>📦 Orders are packed at the farm within 6 hours of purchase.</p>
              <p>🚚 Shipped within 24 hours in temperature-controlled packaging.</p>
              <p>🏡 Delivered to your door within 72 hours, with a live tracker on your order page.</p>
              <p>💚 Free delivery on orders over $50. A flat $4.99 fee applies otherwise.</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-6 font-display text-2xl font-bold text-brand-900">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} farmer={data.farmers.find((f) => f.id === p.farmerId)} />)}
          </div>
        </section>
      )}
    </div>
  );
}
