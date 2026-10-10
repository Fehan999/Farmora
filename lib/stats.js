export function revenueByDay(orders, days = 7) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const value = orders
      .filter((o) => o.status !== "cancelled" && new Date(o.createdAt) >= d && new Date(o.createdAt) < next)
      .reduce((s, o) => s + o.total, 0);
    out.push({ label: d.toLocaleDateString("en-US", { weekday: "short" }), value: +value.toFixed(2) });
  }
  return out;
}
