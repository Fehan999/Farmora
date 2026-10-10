"use client";
import Link from "next/link";
import Stars from "./Stars";
import SafeImage from "./SafeImage";
import { useShop } from "@/context/ShopContext";
import { CATEGORIES } from "@/data/seed";
import { money } from "@/lib/format";

const CATEGORY_IMAGE = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.image]));

export default function ProductCard({ product, farmer }) {
  const { addToCart, toggleWishlist, wishlist, finalPrice } = useShop();
  const saved = wishlist.includes(product.id);
  const price = finalPrice(product);
  const soldOut = product.stock <= 0;

  return (
    <div className="group card relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-brand-50">
        <SafeImage src={product.image} alt={product.name} sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 300px" fallbackSrc={CATEGORY_IMAGE[product.category]}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${soldOut ? "opacity-60 grayscale" : ""}`} />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.discount > 0 && <span className="badge bg-red-500 text-white shadow-sm">-{product.discount}%</span>}
          {product.organic && <span className="badge bg-brand-600 text-white shadow-sm">Organic</span>}
          {soldOut && <span className="badge bg-gray-800 text-white shadow-sm">Sold out</span>}
        </div>
        {product.sold > 700 && <span className="badge absolute bottom-3 left-3 bg-white/90 text-amber-700 shadow-sm">★ Best seller</span>}
      </Link>
      <button type="button" onClick={() => toggleWishlist(product)} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow transition hover:scale-110 ${saved ? "text-red-500" : "text-gray-500"}`}>
        {saved ? "♥" : "♡"}
      </button>
      <div className="flex flex-1 flex-col p-4">
        {farmer && <Link href={`/farmers/${farmer.id}`} className="line-clamp-1 text-xs font-medium text-earth-600 hover:underline">{farmer.name}</Link>}
        <Link href={`/product/${product.id}`} className="mt-0.5 line-clamp-1 font-semibold text-gray-900 hover:text-brand-700">{product.name}</Link>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <Stars value={product.rating} size="text-xs" /> <span className="font-medium text-gray-700">{product.rating}</span> <span>({product.reviewsCount})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-lg font-bold text-brand-700">{money(price)}</span>
            <span className="text-xs text-gray-500"> / {product.unit}</span>
            {product.discount > 0 && <div className="text-xs text-gray-400 line-through">{money(product.price)}</div>}
          </div>
          <button type="button" disabled={soldOut} onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-xl text-white shadow transition hover:bg-brand-700 active:scale-95 disabled:bg-gray-300">+</button>
        </div>
      </div>
    </div>
  );
}
