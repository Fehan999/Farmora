"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/db";
import { money, SHIPPING_FEE, SHIPPING_FREE_OVER, TAX_RATE, COUPONS } from "@/lib/format";

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart, toast } = useShop();
  const [addr, setAddr] = useState({ fullName: user?.name || "", phone: user?.phone || "", street: "", city: "", zip: "", notes: "" });
  const [payment, setPayment] = useState("Card");
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [busy, setBusy] = useState(false);

  const discount = coupon ? cartTotal * COUPONS[coupon] : 0;
  const shipping = cartTotal - discount >= SHIPPING_FREE_OVER ? 0 : SHIPPING_FEE;
  const tax = (cartTotal - discount) * TAX_RATE;
  const total = cartTotal - discount + shipping + tax;

  function applyCoupon() {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) { setCoupon(c); toast(`Coupon ${c} applied`); } else toast("Invalid coupon code", "error");
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!user) { router.push("/login?next=/checkout"); return; }
    if (payment === "Card" && card.number.replace(/\s/g, "").length < 12) { toast("Enter a valid card number (demo: 4242 4242 4242 4242)", "error"); return; }
    setBusy(true);
    const order = await createOrder({
      buyerId: user.uid, buyerName: addr.fullName, buyerEmail: user.email,
      items: cart, farmerIds: [...new Set(cart.map((i) => i.farmerId))],
      subtotal: cartTotal, discount, coupon, shipping, tax, total,
      address: addr, payment: payment === "Card" ? `Card •••• ${card.number.slice(-4)}` : payment,
    });
    clearCart();
    router.push(`/orders/${order.id}?new=1`);
  }

  if (cart.length === 0) {
    return <div className="container-x py-24 text-center"><div className="text-6xl">🧺</div><h1 className="mt-4 text-2xl font-bold">Nothing to check out</h1><Link href="/shop" className="btn-primary mt-6">Go shopping</Link></div>;
  }

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <form onSubmit={placeOrder} className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {!user && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">You need an account to place an order. <Link href="/login?next=/checkout" className="font-semibold underline">Sign in</Link> or try a demo buyer account.</div>
          )}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">1. Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Full name</label><input required className="input" value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} /></div>
              <div><label className="label">Phone</label><input required className="input" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label">Street address</label><input required className="input" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} /></div>
              <div><label className="label">City</label><input required className="input" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /></div>
              <div><label className="label">ZIP code</label><input required className="input" value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label">Delivery notes (optional)</label><textarea className="input" value={addr.notes} onChange={(e) => setAddr({ ...addr, notes: e.target.value })} /></div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">2. Payment</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[["Card", "💳 Credit / Debit card"], ["Cash on Delivery", "💵 Cash on delivery"]].map(([v, l]) => (
                <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 ${payment === v ? "border-brand-600 bg-brand-50" : "border-gray-100"}`}>
                  <input type="radio" checked={payment === v} onChange={() => setPayment(v)} className="accent-brand-600" /> {l}
                </label>
              ))}
            </div>
            {payment === "Card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3"><label className="label">Card number</label><input className="input" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></div>
                <div><label className="label">Expiry</label><input className="input" placeholder="12/28" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} /></div>
                <div><label className="label">CVC</label><input className="input" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} /></div>
                <p className="self-end text-xs text-gray-400">Demo checkout, no real charge is made.</p>
              </div>
            )}
          </div>
        </div>
        <div className="card h-fit space-y-3 p-6">
          <h2 className="text-lg font-semibold">Your order</h2>
          <div className="max-h-64 space-y-3 overflow-auto">
            {cart.map((i) => (
              <div key={i.productId} className="flex items-center gap-3 text-sm">
                <SafeImage src={i.image} className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1">{i.name} <span className="text-gray-400">× {i.qty}</span></span>
                <span className="font-medium">{money(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t pt-3">
            <input className="input" placeholder="Coupon (FRESH10)" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="button" onClick={applyCoupon} className="btn-outline">Apply</button>
          </div>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{money(cartTotal)}</span></div>
          {coupon && <div className="flex justify-between text-sm text-brand-700"><span>Discount ({coupon})</span><span>−{money(discount)}</span></div>}
          <div className="flex justify-between text-sm"><span>Delivery</span><span>{shipping ? money(shipping) : "Free"}</span></div>
          <div className="flex justify-between text-sm"><span>Tax (5%)</span><span>{money(tax)}</span></div>
          <div className="flex justify-between border-t pt-3 text-xl font-bold"><span>Total</span><span>{money(total)}</span></div>
          <div className="rounded-xl bg-brand-50 p-3 text-xs text-brand-800">🚚 Estimated delivery: <b>{new Date(Date.now() + 72 * 36e5).toDateString()}</b></div>
          <button disabled={busy} className="btn-primary w-full py-3">{busy ? "Placing order..." : `Place order · ${money(total)}`}</button>
        </div>
      </form>
    </>
  );
}
