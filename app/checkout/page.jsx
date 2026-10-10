"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import Spinner from "@/components/Spinner";
import { startNav } from "@/components/RouteProgress";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/db";
import { money, SHIPPING_FEE, SHIPPING_FREE_OVER, TAX_RATE, COUPONS } from "@/lib/format";
import { PRODUCTS } from "@/data/seed";
import { PAGE_IMAGES } from "@/data/images";

const PICKS = ["p9", "p21", "p17"].map((id) => PRODUCTS.find((p) => p.id === id)).filter((p) => p?.image);
const TILT = ["left-0 -rotate-6", "left-14 z-10 -translate-y-2", "left-28 rotate-6"];
const LOGIN_HREF = "/login?role=buyer&next=/checkout";

function Loading({ label }) {
  return <div className="container-x grid min-h-[50vh] place-items-center py-24"><Spinner size={48} label={label} /></div>;
}

function EmptyCheckout() {
  return (
    <div className="container-x py-24 text-center">
      <div className="relative mx-auto h-28 w-56">
        {PICKS.map((p, n) => (
          <SafeImage key={p.id} src={p.image} alt={p.name} sizes="112px" className={`absolute top-0 h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg ${TILT[n]}`} />
        ))}
        <span className="absolute -bottom-3 left-1/2 z-20 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-white text-2xl shadow-md">🧺</span>
      </div>
      <h1 className="mt-8 text-2xl font-bold">Nothing to check out</h1>
      <p className="mt-1 text-gray-500">Your basket is empty. Add some fresh picks first.</p>
      <Link href="/shop" className="btn-primary mt-6">Go shopping</Link>
    </div>
  );
}

function AdminNotice() {
  return (
    <div className="container-x py-24 text-center">
      <div className="text-6xl">🛡️</div>
      <h1 className="mt-4 text-2xl font-bold">Admins can't place orders</h1>
      <p className="mx-auto mt-2 max-w-md text-gray-500">You're signed in with an admin account, which is for running the marketplace. Sign in as a customer to try checkout, or head back to your dashboard.</p>
      <Link href="/admin" className="btn-primary mt-6">Go to admin dashboard</Link>
    </div>
  );
}

export default function Checkout() {
  const { user, loading } = useAuth();
  const { cart, ready } = useShop();
  const [placed, setPlaced] = useState(false);

  if (placed) return <Loading label="Opening your order..." />;
  if (!ready || loading) return <Loading label="Loading your basket..." />;
  if (user?.role === "admin") return <AdminNotice />;
  if (cart.length === 0) return <EmptyCheckout />;
  return <CheckoutForm user={user} onPlaced={() => setPlaced(true)} />;
}

function CheckoutForm({ user, onPlaced }) {
  const router = useRouter();
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
    if (!user) { startNav(LOGIN_HREF); router.push(LOGIN_HREF); return; }
    if (payment === "Card" && card.number.replace(/\s/g, "").length < 12) { toast("Enter a valid card number (demo: 4242 4242 4242 4242)", "error"); return; }
    setBusy(true);
    try {
      const order = await createOrder({
        buyerId: user.uid, buyerName: addr.fullName, buyerEmail: user.email,
        items: cart, farmerIds: [...new Set(cart.map((i) => i.farmerId))],
        subtotal: cartTotal, discount, coupon, shipping, tax, total,
        address: addr, payment: payment === "Card" ? `Card •••• ${card.number.slice(-4)}` : payment,
      });
      const to = `/orders/${order.id}?new=1`;
      onPlaced();
      startNav(to);
      router.push(to);
      clearCart();
    } catch {
      setBusy(false);
      toast("Could not place your order. Please try again.", "error");
    }
  }

  return (
    <>
      <PageHeader title="Checkout" subtitle="Almost there. Your farmers will start packing as soon as you order." crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} image={PAGE_IMAGES.checkout} imageAlt="Farm fresh milk, cheese and eggs" />
      <form onSubmit={placeOrder} className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {!user && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">You need an account to place an order. <Link href={LOGIN_HREF} className="font-semibold underline">Sign in</Link> or <Link href={LOGIN_HREF} className="font-semibold underline">try the demo customer account</Link>.</div>
          )}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">1. Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="checkout-full-name" className="label">Full name</label><input id="checkout-full-name" required className="input" value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} /></div>
              <div><label htmlFor="checkout-phone" className="label">Phone</label><input id="checkout-phone" required className="input" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} /></div>
              <div className="sm:col-span-2"><label htmlFor="checkout-street-address" className="label">Street address</label><input id="checkout-street-address" required className="input" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} /></div>
              <div><label htmlFor="checkout-city" className="label">City</label><input id="checkout-city" required className="input" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /></div>
              <div><label htmlFor="checkout-zip-code" className="label">ZIP code</label><input id="checkout-zip-code" required className="input" value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} /></div>
              <div className="sm:col-span-2"><label htmlFor="checkout-delivery-notes-optional" className="label">Delivery notes (optional)</label><textarea id="checkout-delivery-notes-optional" className="input" value={addr.notes} onChange={(e) => setAddr({ ...addr, notes: e.target.value })} /></div>
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
                <div className="sm:col-span-3"><label htmlFor="checkout-card-number" className="label">Card number</label><input id="checkout-card-number" className="input" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></div>
                <div><label htmlFor="checkout-expiry" className="label">Expiry</label><input id="checkout-expiry" className="input" placeholder="12/28" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} /></div>
                <div><label htmlFor="checkout-cvc" className="label">CVC</label><input id="checkout-cvc" className="input" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} /></div>
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
                <SafeImage src={i.image} alt={i.name} sizes="48px" className="h-12 w-12 rounded-lg object-cover" />
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
