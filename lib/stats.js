import { itemsSubtotal, commissionOf, COMMISSION_RATE } from "./format";

export const FEE_PCT = Math.round(COMMISSION_RATE * 100);
export const PAYOUT_PCT = 100 - FEE_PCT;

export const isActiveOrder = (o) => o.status !== "cancelled";
export const orderGross = (o) => itemsSubtotal(o.items || []);
export const orderCommission = (o) => commissionOf(orderGross(o));
export const orderPayout = (o) => orderGross(o) - orderCommission(o);

export function valueByDay(orders, valueOf = (o) => o.total, days = 7) {
  const out = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(today); start.setDate(today.getDate() - (days - 1));
  const sums = new Array(days).fill(0);
  orders.forEach((o) => {
    if (!isActiveOrder(o)) return;
    const t = new Date(o.createdAt);
    if (t < start) return;
    const day = new Date(t); day.setHours(0, 0, 0, 0);
    const idx = Math.round((day - start) / 864e5);
    if (idx >= 0 && idx < days) sums[idx] += valueOf(o) || 0;
  });
  for (let i = 0; i < days; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    out.push({ label: d.toLocaleDateString("en-US", { weekday: "short" }), value: +sums[i].toFixed(2) });
  }
  return out;
}

export const revenueByDay = (orders, days = 7) => valueByDay(orders, (o) => o.total, days);
export const commissionByDay = (orders, days = 7) => valueByDay(orders, orderCommission, days);
