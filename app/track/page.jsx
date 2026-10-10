"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DeliveryTracker from "@/components/DeliveryTracker";
import SafeImage from "@/components/SafeImage";
import { PAGE_IMAGES, SITE_IMAGES } from "@/data/images";
import { CATEGORIES } from "@/data/seed";
import { getOrder } from "@/lib/db";

const ROUTE_IMAGE = SITE_IMAGES.heroMain || PAGE_IMAGES.shop || CATEGORIES[0].image;
const STAGES = [["🧾", "Placed"], ["📦", "Packed"], ["🚚", "Shipped"], ["🏡", "Delivered"]];

export default function Track() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(undefined);

  async function submit(e) {
    e.preventDefault();
    setOrder(await getOrder(id.trim().toUpperCase()));
  }

  return (
    <>
      <PageHeader title="Track your order" subtitle="Enter your order number to see live delivery progress." crumbs={[{ label: "Track order" }]} image={PAGE_IMAGES.track} imageAlt="Open pasture on a partner ranch" />
      <div className="container-x max-w-3xl py-10">
        <form onSubmit={submit} className="flex gap-3">
          <input className="input" placeholder="e.g. ORD-10240" value={id} onChange={(e) => setId(e.target.value)} />
          <button className="btn-primary">Track</button>
        </form>
        <p className="mt-2 text-xs text-gray-400">Try a sample order: ORD-10240, ORD-10241, ORD-10245</p>
        <div className="mt-8">
          {order === null && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">No order found with that number.</p>}
          {order && <><h2 className="mb-4 text-lg font-semibold">Order {order.id}</h2><DeliveryTracker order={order} /></>}
          {!order && (
            <div className="card grid overflow-hidden sm:grid-cols-2">
              <div className="h-48 bg-gradient-to-br from-brand-500 to-brand-700 sm:h-full">
                {ROUTE_IMAGE && <SafeImage src={ROUTE_IMAGE} alt="Fresh produce packed at the farm for delivery" sizes="(max-width: 640px) 92vw, 380px" className="h-full w-full object-cover" />}
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-brand-900">Farm to door in 72 hours</h2>
                <p className="mt-1 text-sm text-gray-500">Every order is packed at the farm and tracked live until it reaches your door.</p>
                <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                  {STAGES.map(([i, l]) => (
                    <div key={l}><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-xl">{i}</span><p className="mt-1 text-xs font-medium text-gray-600">{l}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
