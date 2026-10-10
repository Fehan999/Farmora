"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DeliveryTracker from "@/components/DeliveryTracker";
import { getOrder } from "@/lib/db";

export default function Track() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(undefined);

  async function submit(e) {
    e.preventDefault();
    setOrder(await getOrder(id.trim().toUpperCase()));
  }

  return (
    <>
      <PageHeader title="Track your order" subtitle="Enter your order number to see live delivery progress." crumbs={[{ label: "Track order" }]} />
      <div className="container-x max-w-3xl py-10">
        <form onSubmit={submit} className="flex gap-3">
          <input className="input" placeholder="e.g. ORD-10240" value={id} onChange={(e) => setId(e.target.value)} />
          <button className="btn-primary">Track</button>
        </form>
        <p className="mt-2 text-xs text-gray-400">Try a sample order: ORD-10240, ORD-10241, ORD-10245</p>
        <div className="mt-8">
          {order === null && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">No order found with that number.</p>}
          {order && <><h2 className="mb-4 text-lg font-semibold">Order {order.id}</h2><DeliveryTracker order={order} /></>}
        </div>
      </div>
    </>
  );
}
