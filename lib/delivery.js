export const DELIVERY_HOURS = 72;

export const STAGES = [
  { key: "placed", label: "Order Placed", at: 0, icon: "📝" },
  { key: "packed", label: "Packed at Farm", at: 6, icon: "📦" },
  { key: "shipped", label: "Shipped", at: 24, icon: "🚚" },
  { key: "out", label: "Out for Delivery", at: 60, icon: "🛵" },
  { key: "delivered", label: "Delivered", at: 72, icon: "🏡" },
];

export function deliveryStatus(order, now = Date.now()) {
  if (order.status === "cancelled") {
    return { percent: 0, stageIndex: -1, stage: { label: "Cancelled", icon: "✖" }, cancelled: true, eta: null };
  }
  const created = new Date(order.createdAt).getTime();
  const hours = Math.max(0, (now - created) / 36e5);
  const percent = Math.min(100, (hours / DELIVERY_HOURS) * 100);
  let stageIndex = 0;
  STAGES.forEach((s, i) => { if (hours >= s.at) stageIndex = i; });
  const eta = new Date(created + DELIVERY_HOURS * 36e5);
  const remaining = Math.max(0, created + DELIVERY_HOURS * 36e5 - now);
  return { percent, stageIndex, stage: STAGES[stageIndex], eta, remaining, delivered: stageIndex === STAGES.length - 1 };
}

export function formatRemaining(ms) {
  if (ms <= 0) return "Delivered";
  const h = Math.floor(ms / 36e5);
  const m = Math.floor((ms % 36e5) / 6e4);
  const d = Math.floor(h / 24);
  return d > 0 ? `${d}d ${h % 24}h ${m}m left` : `${h}h ${m}m left`;
}
