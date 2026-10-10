import { deliveryStatus } from "@/lib/delivery";

export default function OrderStatusBadge({ order }) {
  const s = deliveryStatus(order);
  const cls = s.cancelled ? "bg-red-100 text-red-700" : s.delivered ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700";
  return <span className={`badge ${cls}`}>{s.stage.icon} {s.stage.label}</span>;
}
