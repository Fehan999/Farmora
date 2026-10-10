"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import RequireRole from "@/components/RequireRole";
import DeliveryTracker from "@/components/DeliveryTracker";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import SafeImage from "@/components/SafeImage";
import useData from "@/components/useData";
import { useAuth } from "@/context/AuthContext";
import { getOrdersForBuyer } from "@/lib/db";
import { money, date } from "@/lib/format";
import { PRODUCTS } from "@/data/seed";
import { PAGE_IMAGES } from "@/data/images";

const PICKS = ["p17", "p9", "p16"].map((id) => PRODUCTS.find((p) => p.id === id)).filter((p) => p?.image);
const TILT = ["left-0 -rotate-6", "left-14 z-10 -translate-y-2", "left-28 rotate-6"];

function Orders() {
  const { user } = useAuth();
  const { data: orders } = useData(() => getOrdersForBuyer(user.uid), [user.uid]);

  return (
    <div className="container-x py-10">
      {!orders ? <p className="text-gray-500">Loading orders...</p> : orders.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="relative mx-auto h-28 w-56">
            {PICKS.map((p, n) => (
              <SafeImage key={p.id} src={p.image} alt={p.name} sizes="112px" className={`absolute top-0 h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg ${TILT[n]}`} />
            ))}
            <span className="absolute -bottom-3 left-1/2 z-20 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-white text-2xl shadow-md">📦</span>
          </div>
          <h2 className="mt-8 text-xl font-semibold">No orders yet</h2>
          <p className="mt-1 text-gray-500">Your first farm-fresh delivery is just a few clicks away.</p>
          <Link href="/shop" className="btn-primary mt-6">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className="card block p-5 transition hover:shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-semibold">{o.id}</p><p className="text-xs text-gray-500">Placed {date(o.createdAt)} · {o.items.length} items</p></div>
                <OrderStatusBadge order={o} />
                <p className="text-lg font-bold">{money(o.total)}</p>
              </div>
              <div className="mt-4 flex -space-x-3">
                {o.items.slice(0, 5).map((i) => <SafeImage key={i.productId} src={i.image} alt={i.name} sizes="48px" className="h-12 w-12 rounded-full border-2 border-white object-cover" />)}
              </div>
              <div className="mt-4"><DeliveryTracker order={o} compact /></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="My orders" subtitle="Track every delivery live — each order arrives within 3 days." crumbs={[{ label: "Orders" }]} image={PAGE_IMAGES.orders} imageAlt="Golden grain field at harvest time" />
      <RequireRole roles={["buyer", "farmer", "admin"]}><Orders /></RequireRole>
    </>
  );
}
