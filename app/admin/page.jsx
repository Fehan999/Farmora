"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import RequireRole from "@/components/RequireRole";
import DashboardShell from "@/components/DashboardShell";
import StatCard from "@/components/StatCard";
import BarChart from "@/components/BarChart";
import SafeImage from "@/components/SafeImage";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import ProductForm from "@/components/ProductForm";
import useData from "@/components/useData";
import { useShop } from "@/context/ShopContext";
import {
  getProducts, getAllOrders, getAllUsers, getFarmers, getMessages,
  patchProduct, removeProduct, saveProduct, updateOrder, setUserStatus,
} from "@/lib/db";
import { revenueByDay } from "@/lib/stats";
import { deliveryStatus } from "@/lib/delivery";
import { money, date, dateTime } from "@/lib/format";
import { CATEGORIES } from "@/data/seed";

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "orders", label: "Orders", icon: "📦" },
  { key: "products", label: "Products", icon: "🥕" },
  { key: "users", label: "Users", icon: "👥" },
  { key: "farmers", label: "Farmers", icon: "🧑‍🌾" },
  { key: "messages", label: "Messages", icon: "✉️" },
];

function Table({ head, children }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr>{head.map((h) => <th key={h} className="whitespace-nowrap p-3">{h}</th>)}</tr></thead>
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const { data, reload } = useData(async () => {
    const [products, orders, users, farmers, messages] = await Promise.all([getProducts({ includeHidden: true }), getAllOrders(), getAllUsers(), getFarmers(), getMessages()]);
    return { products, orders, users, farmers, messages };
  });

  const chart = useMemo(() => revenueByDay(data?.orders || []), [data]);
  if (!data) return <div className="container-x py-24 text-center text-gray-500">Loading dashboard...</div>;
  const { products, orders, users, farmers, messages } = data;
  const farmerName = (id) => farmers.find((f) => f.id === id)?.name || "—";
  const valid = orders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const match = (s) => s.toLowerCase().includes(q.toLowerCase());

  const categoryStats = CATEGORIES.map((c) => ({
    ...c,
    value: valid.reduce((s, o) => s + o.items.filter((i) => products.find((p) => p.id === i.productId)?.category === c.slug).reduce((a, i) => a + i.price * i.qty, 0), 0),
  }));
  const maxCat = Math.max(1, ...categoryStats.map((c) => c.value));

  const filteredOrders = orders.filter((o) => {
    const st = deliveryStatus(o);
    const key = st.cancelled ? "cancelled" : st.delivered ? "delivered" : "active";
    return (statusFilter === "all" || statusFilter === key) && match(`${o.id} ${o.buyerName}`);
  });

  async function act(fn, msg) { await fn(); toast(msg); reload(); }

  function exportCsv() {
    const rows = [["Order", "Buyer", "Date", "Items", "Total", "Status"], ...orders.map((o) => [o.id, o.buyerName, o.createdAt, o.items.length, o.total.toFixed(2), deliveryStatus(o).stage.label])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "farmora-orders.csv";
    a.click();
  }

  return (
    <DashboardShell title="Admin dashboard" subtitle="Monitor the marketplace, manage users, products and orders." tabs={TABS} tab={tab} setTab={(t) => { setTab(t); setQ(""); }}
      actions={<button onClick={exportCsv} className="btn-outline">⬇ Export orders CSV</button>}>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon="💰" label="Total revenue" value={money(revenue)} hint={`${valid.length} completed orders`} />
            <StatCard icon="📦" label="Orders" value={orders.length} tone="blue" hint={`${orders.filter((o) => deliveryStatus(o).delivered).length} delivered`} />
            <StatCard icon="👥" label="Users" value={users.length} tone="earth" hint={`${users.filter((u) => u.role === "farmer").length} farmers`} />
            <StatCard icon="🥕" label="Products" value={products.length} tone="rose" hint={`${products.filter((p) => p.stock < 20).length} low stock`} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card p-6"><h3 className="mb-4 font-semibold">Revenue — last 7 days</h3><BarChart data={chart} format={money} /></div>
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Sales by category</h3>
              <div className="space-y-3">
                {categoryStats.map((c) => (
                  <div key={c.slug}>
                    <div className="mb-1 flex justify-between text-xs"><span>{c.icon} {c.name}</span><span className="font-semibold">{money(c.value)}</span></div>
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-earth-400" style={{ width: `${(c.value / maxCat) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Latest orders</h3>
              <div className="divide-y text-sm">
                {orders.slice(0, 6).map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2.5">
                    <div><Link href={`/orders/${o.id}`} className="font-medium hover:text-brand-700">{o.id}</Link><p className="text-xs text-gray-500">{o.buyerName}</p></div>
                    <OrderStatusBadge order={o} />
                    <span className="font-semibold">{money(o.total)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Top products</h3>
              <div className="divide-y text-sm">
                {[...products].sort((a, b) => b.sold - a.sold).slice(0, 6).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 py-2.5">
                    <span className="w-5 text-gray-400">{i + 1}</span>
                    <SafeImage src={p.image} className="h-9 w-9 rounded-lg object-cover" />
                    <span className="flex-1 font-medium">{p.name}</span>
                    <span className="text-gray-500">{p.sold} sold</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input className="input max-w-xs" placeholder="Search order or buyer..." value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option><option value="active">In transit</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Table head={["Order", "Buyer", "Date", "Items", "Total", "Payment", "Status", ""]}>
            {filteredOrders.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-medium"><Link href={`/orders/${o.id}`} className="hover:text-brand-700">{o.id}</Link></td>
                <td className="p-3">{o.buyerName}<div className="text-xs text-gray-400">{o.buyerEmail}</div></td>
                <td className="whitespace-nowrap p-3">{dateTime(o.createdAt)}</td>
                <td className="p-3">{o.items.length}</td>
                <td className="p-3 font-semibold">{money(o.total)}</td>
                <td className="p-3">{o.payment}</td>
                <td className="p-3"><OrderStatusBadge order={o} /></td>
                <td className="p-3 text-right">
                  {o.status === "cancelled"
                    ? <button onClick={() => act(() => updateOrder(o.id, { status: "placed" }), "Order restored")} className="text-brand-700 hover:underline">Restore</button>
                    : <button onClick={() => act(() => updateOrder(o.id, { status: "cancelled" }), "Order cancelled")} className="text-red-600 hover:underline">Cancel</button>}
                </td>
              </tr>
            ))}
          </Table>
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
                <td className="p-3"><div className="flex items-center gap-3"><SafeImage src={p.image} className="h-10 w-10 rounded-lg object-cover" /><Link href={`/product/${p.id}`} className="font-medium hover:text-brand-700">{p.name}</Link></div></td>
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
                <td className="p-3"><div className="flex items-center gap-3"><SafeImage src={u.avatar || `https://i.pravatar.cc/80?u=${u.id}`} className="h-9 w-9 rounded-full object-cover" /><div><p className="font-medium">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div></div></td>
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
          {farmers.map((f) => {
            const fp = products.filter((p) => p.farmerId === f.id);
            const fr = valid.reduce((s, o) => s + o.items.filter((i) => i.farmerId === f.id).reduce((a, i) => a + i.price * i.qty, 0), 0);
            return (
              <div key={f.id} className="card flex gap-4 p-5">
                <SafeImage src={f.avatar} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 text-sm">
                  <Link href={`/farmers/${f.id}`} className="font-semibold hover:text-brand-700">{f.name}</Link> {f.verified ? <span className="badge bg-brand-100 text-brand-700">Verified</span> : <span className="badge bg-amber-100 text-amber-700">Pending</span>}
                  <p className="text-gray-500">{f.owner} · {f.location}</p>
                  <p className="text-gray-500">{f.email}</p>
                  <div className="mt-2 flex gap-4 text-xs"><span><b>{fp.length}</b> products</span><span><b>{money(fr)}</b> revenue</span><span>⭐ {f.rating}</span></div>
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
