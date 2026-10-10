"use client";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DeliveryTracker from "@/components/DeliveryTracker";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import SafeImage from "@/components/SafeImage";
import useData from "@/components/useData";
import { getOrder, updateOrder } from "@/lib/db";
import { deliveryStatus } from "@/lib/delivery";
import { money, dateTime } from "@/lib/format";
import { useShop } from "@/context/ShopContext";

function OrderDetail() {
  const { id } = useParams();
  const params = useSearchParams();
  const { toast } = useShop();
  const { data: order, loading, reload } = useData(() => getOrder(id), [id]);

  if (loading && !order) return <div className="container-x py-24 text-center text-gray-500">Loading...</div>;
  if (!order) return <div className="container-x py-24 text-center"><h1 className="text-2xl font-bold">Order not found</h1><Link href="/orders" className="btn-primary mt-4">My orders</Link></div>;

  const s = deliveryStatus(order);
  const canCancel = !s.cancelled && s.stageIndex < 2;

  async function cancel() {
    if (!confirm("Cancel this order?")) return;
    await updateOrder(order.id, { status: "cancelled" });
    toast("Order cancelled", "info");
    reload();
  }

  return (
    <div className="container-x py-10">
      {params.get("new") && (
        <div className="mb-8 rounded-2xl bg-brand-600 p-6 text-center text-white">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-2 text-2xl font-bold">Thank you! Your order is confirmed.</h1>
          <p className="text-brand-100">The farm has been notified and will start packing shortly.</p>
        </div>
      )}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/orders" className="text-sm text-gray-500 hover:text-brand-700">← All orders</Link>
          <h2 className="mt-1 text-2xl font-bold">Order {order.id}</h2>
          <p className="text-sm text-gray-500">Placed {dateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge order={order} />
          <button onClick={() => window.print()} className="btn-ghost">🖨 Invoice</button>
          {canCancel && <button onClick={cancel} className="btn-danger">Cancel order</button>}
        </div>
      </div>
      <DeliveryTracker order={order} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="card divide-y">
          {order.items.map((i) => (
            <div key={i.productId} className="flex items-center gap-4 p-4">
              <SafeImage src={i.image} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1"><Link href={`/product/${i.productId}`} className="font-semibold hover:text-brand-700">{i.name}</Link><p className="text-sm text-gray-500">{money(i.price)} × {i.qty}</p></div>
              <p className="font-bold">{money(i.price * i.qty)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="card space-y-2 p-5 text-sm">
            <h3 className="font-semibold">Summary</h3>
            <div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-brand-700"><span>Discount</span><span>−{money(order.discount)}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{order.shipping ? money(order.shipping) : "Free"}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{money(order.tax)}</span></div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>{money(order.total)}</span></div>
            <p className="pt-2 text-gray-500">Paid with: {order.payment}</p>
          </div>
          <div className="card space-y-1 p-5 text-sm">
            <h3 className="mb-1 font-semibold">Delivery address</h3>
            <p>{order.address?.fullName}</p>
            <p className="text-gray-500">{order.address?.street}, {order.address?.city} {order.address?.zip}</p>
            <p className="text-gray-500">{order.address?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return <Suspense><OrderDetail /></Suspense>;
}
