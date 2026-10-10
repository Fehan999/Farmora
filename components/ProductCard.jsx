"use client";
import Link from "next/link";
import Stars from "./Stars";
import SafeImage from "./SafeImage";
import { useShop } from "@/context/ShopContext";
import { money } from "@/lib/format";

export default function ProductCard({ product, farmer }) {
  const { addToCart, toggleWishlist, wishlist, finalPrice } = useShop();
  const saved = wishlist.includes(product.id);
  const price = finalPrice(product);

  return (
    <div className="group card relative flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-brand-50">
        <SafeImage src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.discount > 0 && <span className="badge bg-red-500 text-white">-{product.discount}%</span>}
          {product.organic && <span className="badge bg-brand-600 text-white">Organic</span>}
          {product.stock <= 0 && <span className="badge bg-gray-800 text-white">Sold out</span>}
        </div>
      </Link>
      <button onClick={() => toggleWishlist(product)}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow transition hover:scale-110 ${saved ? "text-red-500" : "text-gray-500"}`}>
        {saved ? "♥" : "♡"}
      </button>
      <div className="flex flex-1 flex-col p-4">
        {farmer && <Link href={`/farmers/${farmer.id}`} className="text-xs font-medium text-earth-600 hover:underline">{farmer.name}</Link>}
        <Link href={`/product/${product.id}`} className="mt-0.5 line-clamp-1 font-semibold text-gray-900 hover:text-brand-700">{product.name}</Link>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <Stars value={product.rating} size="text-xs" /> <span>({product.reviewsCount})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-lg font-bold text-brand-700">{money(price)}</span>
            <span className="text-xs text-gray-500"> / {product.unit}</span>
            {product.discount > 0 && <div className="text-xs text-gray-400 line-through">{money(product.price)}</div>}
          </div>
          <button disabled={product.stock <= 0} onClick={() => addToCart(product)}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-xl text-white shadow transition hover:bg-brand-700 disabled:bg-gray-300">+</button>
        </div>
      </div>
    </div>
  );
}
