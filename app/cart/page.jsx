"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { useShop } from "@/context/ShopContext";
import { money, SHIPPING_FEE, SHIPPING_FREE_OVER } from "@/lib/format";
import { PRODUCTS } from "@/data/seed";
import { PAGE_IMAGES } from "@/data/images";

const PICKS = ["p12", "p1", "p21"].map((id) => PRODUCTS.find((p) => p.id === id)).filter((p) => p?.image);
const TILT = ["left-0 -rotate-6", "left-14 z-10 -translate-y-2", "left-28 rotate-6"];

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useShop();
  const shipping = cartTotal >= SHIPPING_FREE_OVER || cartTotal === 0 ? 0 : SHIPPING_FEE;
  const progress = Math.min(100, (cartTotal / SHIPPING_FREE_OVER) * 100);

  return (
    <>
      <PageHeader title="Your cart" subtitle="Review your basket of farm-fresh goodies before checkout." crumbs={[{ label: "Cart" }]} image={PAGE_IMAGES.cart} imageAlt="Freshly baked bread from a farm bakery" />
      <div className="container-x py-10">
        {cart.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="relative mx-auto h-28 w-56">
              {PICKS.map((p, n) => (
                <SafeImage key={p.id} src={p.image} alt={p.name} sizes="112px" className={`absolute top-0 h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg ${TILT[n]}`} />
              ))}
              <span className="absolute -bottom-3 left-1/2 z-20 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-white text-2xl shadow-md">🧺</span>
            </div>
            <h2 className="mt-8 text-xl font-semibold">Your basket is empty</h2>
            <p className="mt-1 text-gray-500">Fresh food is just a few clicks away.</p>
            <Link href="/shop" className="btn-primary mt-6">Start shopping</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <div className="card p-4">
                <p className="text-sm">{cartTotal >= SHIPPING_FREE_OVER ? "🎉 You've unlocked free delivery!" : `Add ${money(SHIPPING_FREE_OVER - cartTotal)} more for free delivery`}</p>
                <div className="mt-2 h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} /></div>
              </div>
              {cart.map((i) => (
                <div key={i.productId} className="card flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                  <SafeImage src={i.image} alt={i.name} sizes="80px" className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${i.productId}`} className="line-clamp-2 font-semibold hover:text-brand-700">{i.name}</Link>
                    <p className="text-sm text-gray-500">{money(i.price)} / {i.unit}</p>
                    <p className="mt-0.5 font-bold sm:hidden">{money(i.price * i.qty)}</p>
                  </div>
                  <div className="flex shrink-0 items-center rounded-full border">
                    <button type="button" aria-label={`Decrease ${i.name} quantity`} onClick={() => updateQty(i.productId, i.qty - 1)} className="px-2.5 py-1 sm:px-3">−</button>
                    <span className="w-7 text-center text-sm font-semibold sm:w-8">{i.qty}</span>
                    <button type="button" aria-label={`Increase ${i.name} quantity`} onClick={() => updateQty(i.productId, i.qty + 1)} className="px-2.5 py-1 sm:px-3">+</button>
                  </div>
                  <p className="hidden w-20 shrink-0 text-right font-bold sm:block">{money(i.price * i.qty)}</p>
                  <button type="button" aria-label={`Remove ${i.name}`} onClick={() => removeFromCart(i.productId)} className="shrink-0 p-1 text-gray-400 hover:text-red-500">✕</button>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-red-600 hover:underline">Clear cart</button>
            </div>
            <div className="card h-fit space-y-3 p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{money(cartTotal)}</span></div>
              <div className="flex justify-between text-sm"><span>Delivery</span><span>{shipping ? money(shipping) : "Free"}</span></div>
              <div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{money(cartTotal + shipping)}</span></div>
              <p className="text-xs text-gray-500">Taxes and coupons are applied at checkout.</p>
              <Link href="/checkout" className="btn-primary w-full py-3">Proceed to checkout</Link>
              <Link href="/shop" className="btn-ghost w-full">Continue shopping</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
