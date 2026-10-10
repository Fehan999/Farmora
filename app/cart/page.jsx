"use client";
import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { useShop } from "@/context/ShopContext";
import { money, SHIPPING_FEE, SHIPPING_FREE_OVER } from "@/lib/format";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useShop();
  const shipping = cartTotal >= SHIPPING_FREE_OVER || cartTotal === 0 ? 0 : SHIPPING_FEE;
  const progress = Math.min(100, (cartTotal / SHIPPING_FREE_OVER) * 100);

  return (
    <>
      <PageHeader title="Your cart" crumbs={[{ label: "Cart" }]} />
      <div className="container-x py-10">
        {cart.length === 0 ? (
          <div className="card py-20 text-center">
            <div className="text-6xl">🧺</div>
            <h2 className="mt-4 text-xl font-semibold">Your basket is empty</h2>
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
                <div key={i.productId} className="card flex items-center gap-4 p-4">
                  <SafeImage src={i.image} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <Link href={`/product/${i.productId}`} className="font-semibold hover:text-brand-700">{i.name}</Link>
                    <p className="text-sm text-gray-500">{money(i.price)} / {i.unit}</p>
                  </div>
                  <div className="flex items-center rounded-full border">
                    <button onClick={() => updateQty(i.productId, i.qty - 1)} className="px-3 py-1">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => updateQty(i.productId, i.qty + 1)} className="px-3 py-1">+</button>
                  </div>
                  <p className="w-20 text-right font-bold">{money(i.price * i.qty)}</p>
                  <button onClick={() => removeFromCart(i.productId)} className="text-gray-400 hover:text-red-500">✕</button>
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
