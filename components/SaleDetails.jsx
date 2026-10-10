"use client";
import SafeImage from "./SafeImage";
import { money, dateTime, commissionOf } from "@/lib/format";
import { orderGross, orderCommission, orderPayout, FEE_PCT, PAYOUT_PCT } from "@/lib/stats";

export default function SaleDetails({ order, farmerName = () => "—", onClose }) {
  const cancelled = order.status === "cancelled";
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Sale {order.id}</h2>
            <p className="text-sm text-gray-500">{order.buyerName} · {order.buyerEmail} · {dateTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <SaleStatus order={order} />
            <button type="button" onClick={onClose} className="text-2xl text-gray-400">×</button>
          </div>
        </div>
        <div className="divide-y rounded-xl border text-sm">
          {(order.items || []).map((i) => {
            const line = i.price * i.qty;
            return (
              <div key={`${i.productId}-${i.farmerId}`} className="flex items-center gap-3 p-3">
                <SafeImage src={i.image} alt={i.name} sizes="40px" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{i.name}</p>
                  <p className="text-xs text-gray-500">{farmerName(i.farmerId)} · {money(i.price)} × {i.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{money(line)}</p>
                  <p className="text-xs text-brand-700">+{money(commissionOf(line))} fee</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4"><p className="text-xs text-gray-500">Order value</p><p className="text-lg font-bold">{money(orderGross(order))}</p></div>
          <div className="rounded-xl bg-brand-50 p-4"><p className="text-xs text-brand-700">Platform commission ({FEE_PCT}%)</p><p className={`text-lg font-bold text-brand-800 ${cancelled ? "line-through opacity-50" : ""}`}>{money(orderCommission(order))}</p></div>
          <div className="rounded-xl bg-earth-50 p-4"><p className="text-xs text-earth-600">Farmer payout ({PAYOUT_PCT}%)</p><p className={`text-lg font-bold ${cancelled ? "line-through opacity-50" : ""}`}>{money(orderPayout(order))}</p></div>
        </div>
        <p className="text-xs text-gray-400">Commission is calculated on product prices only. Delivery fees, taxes and coupon discounts are not part of platform earnings.</p>
      </div>
    </div>
  );
}

export function SaleStatus({ order }) {
  return order.status === "cancelled"
    ? <span className="badge bg-red-100 text-red-700">Cancelled</span>
    : <span className="badge bg-brand-100 text-brand-700">Completed</span>;
}
