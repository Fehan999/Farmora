"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import RequireRole from "@/components/RequireRole";
import DashboardShell from "@/components/DashboardShell";
import StatCard from "@/components/StatCard";
import BarChart from "@/components/BarChart";
import SafeImage from "@/components/SafeImage";
import ProductForm from "@/components/ProductForm";
import SaleDetails, { SaleStatus } from "@/components/SaleDetails";
import useData from "@/components/useData";
import { useShop } from "@/context/ShopContext";
import {
  getProducts, getAllOrders, getAllUsers, getFarmers, getMessages,
  patchProduct, removeProduct, saveProduct, updateOrder, setUserStatus,
} from "@/lib/db";
import { commissionByDay, isActiveOrder, orderGross, orderCommission, orderPayout, FEE_PCT, PAYOUT_PCT } from "@/lib/stats";
import { money, date, dateTime, commissionOf } from "@/lib/format";
import { CATEGORIES } from "@/data/seed";

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "sales", label: "Sales", icon: "💵" },
  { key: "products", label: "Products", icon: "🥕" },
  { key: "users", label: "Users", icon: "👥" },
  { key: "farmers", label: "Farmers", icon: "🧑‍🌾" },
  { key: "messages", label: "Messages", icon: "✉️" },
];

const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function Table({ head, children }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr>{head.map((h, i) => <th key={i} className="whitespace-nowrap p-3">{h}</th>)}</tr></thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

function Admin() {
  const { toast } = useShop();
  const [tab, setTab] = useState("overview");
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [saleFilter, setSaleFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const { data, reload } = useData(async () => {
    const [products, orders, users, farmers, messages] = await Promise.all([getProducts({ includeHidden: true }), getAllOrders(), getAllUsers(), getFarmers(), getMessages()]);
    return { products, orders, users, farmers, messages };
  });

  const stats = useMemo(() => {
    if (!data) return null;
    const { products, orders, farmers } = data;
    const productMap = new Map(products.map((p) => [p.id, p]));
    const farmerMap = new Map(farmers.map((f) => [f.id, f]));
    const valid = orders.filter(isActiveOrder);
    const byCategory = {};
    const byFarmer = {};
    let gross = 0;
    valid.forEach((o) => (o.items || []).forEach((i) => {
      const line = i.price * i.qty;
      const cat = i.category || productMap.get(i.productId)?.category;
      gross += line;
      byCategory[cat] = (byCategory[cat] || 0) + line;
      byFarmer[i.farmerId] = (byFarmer[i.farmerId] || 0) + line;
    }));
    const commission = commissionOf(gross);
    const categories = CATEGORIES.map((c) => ({ ...c, value: commissionOf(byCategory[c.slug] || 0) })).sort((a, b) => b.value - a.value);
    return {
      farmerMap, valid, gross, commission, payout: gross - commission, byFarmer, categories,
      maxCat: Math.max(1, ...categories.map((c) => c.value)),
      chart: commissionByDay(orders),
      topProducts: [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6),
      farmerRows: farmers.map((f) => ({ ...f, gross: byFarmer[f.id] || 0, products: products.filter((p) => p.farmerId === f.id).length })).sort((a, b) => b.gross - a.gross),
    };
  }, [data]);

  if (!data || !stats) return <div className="container-x py-24 text-center text-gray-500">Loading dashboard...</div>;
  const { products, orders, users, messages } = data;
  const farmerName = (id) => stats.farmerMap.get(id)?.name || "—";
  const match = (s) => s.toLowerCase().includes(q.toLowerCase());

  const filteredSales = orders.filter((o) => {
    const key = isActiveOrder(o) ? "completed" : "cancelled";
    return (saleFilter === "all" || saleFilter === key) && match(`${o.id} ${o.buyerName || ""} ${o.buyerEmail || ""}`);
  });
  const filteredGross = filteredSales.filter(isActiveOrder).reduce((s, o) => s + orderGross(o), 0);

  async function act(fn, msg) { await fn(); toast(msg); reload(); }

  function exportCsv() {
    const list = tab === "sales" ? filteredSales : orders;
    const rows = [
      ["Order", "Buyer", "Email", "Date", "Items", "Order value", `Commission (${FEE_PCT}%)`, `Farmer payout (${PAYOUT_PCT}%)`, "Status"],
      ...list.map((o) => {
        const ok = isActiveOrder(o);
        return [o.id, o.buyerName, o.buyerEmail, o.createdAt, (o.items || []).length, orderGross(o).toFixed(2), ok ? orderCommission(o).toFixed(2) : "0.00", ok ? orderPayout(o).toFixed(2) : "0.00", ok ? "Completed" : "Cancelled"];
      }),
    ];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(cell).join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "farmora-sales.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <DashboardShell title="Admin dashboard" subtitle={`Farmora earns ${FEE_PCT}% of the product price on every sale.`} tabs={TABS} tab={tab} setTab={(t) => { setTab(t); setQ(""); }}
      actions={<button onClick={exportCsv} className="btn-outline">⬇ Export sales CSV</button>}>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard icon="💰" label={`Platform earnings (${FEE_PCT}%)`} value={money(stats.commission)} hint={`From ${stats.valid.length} completed sales`} />
            <StatCard icon="🧾" label="Gross sales" value={money(stats.gross)} tone="blue" hint="Product value of completed sales" />
            <StatCard icon="🧑‍🌾" label={`Paid to farmers (${PAYOUT_PCT}%)`} value={money(stats.payout)} tone="earth" hint={`${data.farmers.length} farms`} />
            <StatCard icon="💵" label="Sales" value={stats.valid.length} tone="blue" hint={`${orders.length - stats.valid.length} cancelled`} />
            <StatCard icon="👥" label="Users" value={users.length} tone="earth" hint={`${users.filter((u) => u.role === "farmer").length} farmers · ${users.filter((u) => u.role === "buyer").length} buyers`} />
            <StatCard icon="🥕" label="Products" value={products.length} tone="rose" hint={`${products.filter((p) => p.stock < 20).length} low stock`} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card p-6">
              <h3 className="font-semibold">Platform earnings — last 7 days</h3>
              <p className="mb-4 text-xs text-gray-500">{FEE_PCT}% commission per day</p>
              <BarChart data={stats.chart} format={money} />
            </div>
            <div className="card p-6">
              <h3 className="font-semibold">Sales by category</h3>
              <p className="mb-4 text-xs text-gray-500">Commission earned per category</p>
              <div className="space-y-3">
                {stats.categories.map((c) => (
                  <div key={c.slug}>
                    <div className="mb-1 flex justify-between text-xs"><span>{c.icon} {c.name}</span><span className="font-semibold">{money(c.value)}</span></div>
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-earth-400" style={{ width: `${(c.value / stats.maxCat) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Latest sales</h3><button onClick={() => setTab("sales")} className="text-sm font-medium text-brand-700 hover:underline">View all →</button></div>
              <div className="divide-y text-sm">
                {orders.slice(0, 6).map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0"><button onClick={() => setViewing(o)} className="font-medium hover:text-brand-700">{o.id}</button><p className="truncate text-xs text-gray-500">{o.buyerName} · {date(o.createdAt)}</p></div>
                    <div className="text-right">
                      <p className="font-semibold">{money(orderGross(o))}</p>
                      {isActiveOrder(o) ? <p className="text-xs font-medium text-brand-700">+{money(orderCommission(o))} earned</p> : <SaleStatus order={o} />}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="py-4 text-gray-500">No sales yet.</p>}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Top products</h3>
              <div className="divide-y text-sm">
                {stats.topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 py-2.5">
                    <span className="w-5 text-gray-400">{i + 1}</span>
                    <SafeImage src={p.image} alt={p.name} sizes="36px" className="h-9 w-9 rounded-lg object-cover" />
                    <span className="flex-1 font-medium">{p.name}</span>
                    <span className="text-gray-500">{p.sold || 0} sold</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "sales" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <input className="input max-w-xs" placeholder="Search order or buyer..." value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="input w-auto" value={saleFilter} onChange={(e) => setSaleFilter(e.target.value)}>
              <option value="all">All</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
            <p className="text-sm text-gray-500 sm:ml-auto">{filteredSales.length} sales · {money(filteredGross)} value · <b className="text-brand-700">{money(commissionOf(filteredGross))} commission</b></p>
          </div>
          <Table head={["Order", "Buyer", "Date", "Items", "Order value", `Commission (${FEE_PCT}%)`, "Farmer payout", "Status", ""]}>
            {filteredSales.map((o) => {
              const off = isActiveOrder(o) ? "" : "text-gray-400 line-through";
              return (
                <tr key={o.id}>
                  <td className="p-3 font-medium"><button onClick={() => setViewing(o)} className="hover:text-brand-700">{o.id}</button></td>
                  <td className="p-3">{o.buyerName}<div className="text-xs text-gray-400">{o.buyerEmail}</div></td>
                  <td className="whitespace-nowrap p-3">{dateTime(o.createdAt)}</td>
                  <td className="p-3">{(o.items || []).length}</td>
                  <td className="p-3 font-semibold">{money(orderGross(o))}</td>
                  <td className={`p-3 font-semibold text-brand-700 ${off}`}>{money(orderCommission(o))}</td>
                  <td className={`p-3 ${off}`}>{money(orderPayout(o))}</td>
                  <td className="p-3"><SaleStatus order={o} /></td>
                  <td className="p-3 text-right">
                    {isActiveOrder(o)
                      ? <button onClick={() => act(() => updateOrder(o.id, { status: "cancelled" }), "Sale cancelled")} className="text-red-600 hover:underline">Cancel</button>
                      : <button onClick={() => act(() => updateOrder(o.id, { status: "placed" }), "Sale restored")} className="text-brand-700 hover:underline">Restore</button>}
                  </td>
                </tr>
              );
            })}
          </Table>
          {filteredSales.length === 0 && <div className="card p-10 text-center text-gray-500">No sales match your filters.</div>}
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between gap-3">
            <input className="input max-w-xs" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
            <button onClick={() => setEditing({ farmerId: "f1" })} className="btn-primary">＋ Add product</button>
          </div>
          <Table head={["Product", "Farm", "Price", "Stock", "Sold", "Featured", "Status", ""]}>
            {products.filter((p) => match(p.name)).map((p) => (
              <tr key={p.id}>
                <td className="p-3"><div className="flex items-center gap-3"><SafeImage src={p.image} alt={p.name} sizes="40px" className="h-10 w-10 rounded-lg object-cover" /><Link href={`/product/${p.id}`} className="font-medium hover:text-brand-700">{p.name}</Link></div></td>
                <td className="p-3">{farmerName(p.farmerId)}</td>
                <td className="p-3">{money(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.sold}</td>
                <td className="p-3"><button onClick={() => act(() => patchProduct(p.id, { featured: !p.featured }), "Updated")} className="text-xl">{p.featured ? "⭐" : "☆"}</button></td>
                <td className="p-3">
                  <select value={p.status || "approved"} onChange={(e) => act(() => patchProduct(p.id, { status: e.target.value }), "Status updated")} className="rounded-lg border px-2 py-1 text-xs">
                    <option value="approved">Approved</option><option value="hidden">Hidden</option><option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="whitespace-nowrap p-3 text-right">
                  <button onClick={() => setEditing(p)} className="mr-3 text-brand-700 hover:underline">Edit</button>
                  <button onClick={() => confirm(`Delete ${p.name}?`) && act(() => removeProduct(p.id), "Product deleted")} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input className="input max-w-xs" placeholder="Search users..." value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="input w-auto" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All roles</option><option value="buyer">Buyers</option><option value="farmer">Farmers</option><option value="admin">Admins</option>
            </select>
          </div>
          <Table head={["User", "Role", "Phone", "Location", "Joined", "Status", ""]}>
            {users.filter((u) => (roleFilter === "all" || u.role === roleFilter) && match(`${u.name} ${u.email}`)).map((u) => (
              <tr key={u.id}>
                <td className="p-3"><div className="flex items-center gap-3"><SafeImage src={u.avatar || `https://i.pravatar.cc/80?u=${u.id}`} alt={u.name} sizes="36px" className="h-9 w-9 rounded-full object-cover" /><div><p className="font-medium">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div></div></td>
                <td className="p-3"><span className={`badge capitalize ${u.role === "admin" ? "bg-purple-100 text-purple-700" : u.role === "farmer" ? "bg-earth-100 text-earth-600" : "bg-sky-100 text-sky-700"}`}>{u.role}</span></td>
                <td className="whitespace-nowrap p-3">{u.phone || "—"}</td>
                <td className="p-3">{u.location || "—"}</td>
                <td className="whitespace-nowrap p-3">{u.createdAt ? date(u.createdAt) : "—"}</td>
                <td className="p-3"><span className={`badge ${u.status === "suspended" ? "bg-red-100 text-red-700" : "bg-brand-100 text-brand-700"}`}>{u.status}</span></td>
                <td className="p-3 text-right">
                  {u.status === "suspended"
                    ? <button onClick={() => act(() => setUserStatus(u.id, "active"), "User activated")} className="text-brand-700 hover:underline">Activate</button>
                    : <button onClick={() => act(() => setUserStatus(u.id, "suspended"), "User suspended")} className="text-red-600 hover:underline">Suspend</button>}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {tab === "farmers" && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.farmerRows.map((f) => {
            const fee = commissionOf(f.gross);
            return (
              <div key={f.id} className="card p-5">
                <div className="flex gap-4">
                  <SafeImage src={f.avatar} alt={f.name} sizes="64px" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1 text-sm">
                    <Link href={`/farmers/${f.id}`} className="font-semibold hover:text-brand-700">{f.name}</Link> {f.verified ? <span className="badge bg-brand-100 text-brand-700">Verified</span> : <span className="badge bg-amber-100 text-amber-700">Pending</span>}
                    <p className="text-gray-500">{f.owner} · {f.location}</p>
                    <p className="truncate text-gray-500">{f.email}</p>
                    <div className="mt-1 flex gap-4 text-xs text-gray-500"><span><b className="text-gray-800">{f.products}</b> products</span><span>⭐ {f.rating}</span></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-gray-50 p-2"><p className="text-[11px] text-gray-500">Gross sales</p><p className="font-bold">{money(f.gross)}</p></div>
                  <div className="rounded-xl bg-brand-50 p-2"><p className="text-[11px] text-brand-700">Commission ({FEE_PCT}%)</p><p className="font-bold text-brand-800">{money(fee)}</p></div>
                  <div className="rounded-xl bg-earth-50 p-2"><p className="text-[11px] text-earth-600">Net earnings ({PAYOUT_PCT}%)</p><p className="font-bold">{money(f.gross - fee)}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 && <div className="card p-10 text-center text-gray-500">No messages yet. Messages from the contact form appear here.</div>}
          {messages.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex justify-between text-sm"><b>{m.name} <span className="font-normal text-gray-400">&lt;{m.email}&gt;</span></b><span className="text-gray-400">{dateTime(m.createdAt)}</span></div>
              <p className="mt-1 text-sm font-medium">{m.subject}</p>
              <p className="mt-2 text-sm text-gray-600">{m.message}</p>
            </div>
          ))}
        </div>
      )}

      {viewing && <SaleDetails order={viewing} farmerName={farmerName} onClose={() => setViewing(null)} />}

      {editing && (
        <ProductForm initial={editing} onClose={() => setEditing(null)}
          onSave={(p) => act(async () => { await saveProduct({ status: "approved", rating: 5, reviewsCount: 0, sold: 0, ...p }); setEditing(null); }, "Product saved")} />
      )}
    </DashboardShell>
  );
}

export default function AdminPage() {
  return <RequireRole roles={["admin"]}><Admin /></RequireRole>;
}
