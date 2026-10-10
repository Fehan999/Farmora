"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import RequireRole from "@/components/RequireRole";
import DashboardShell from "@/components/DashboardShell";
import ProductForm from "@/components/ProductForm";
import StatCard from "@/components/StatCard";
import BarChart from "@/components/BarChart";
import SafeImage from "@/components/SafeImage";
import DeliveryTracker from "@/components/DeliveryTracker";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import useData from "@/components/useData";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { getProducts, getOrdersForFarmer, saveProduct, removeProduct } from "@/lib/db";
import { revenueByDay } from "@/lib/stats";
import { money, date } from "@/lib/format";
import { CATEGORIES } from "@/data/seed";

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "products", label: "My products", icon: "🥕" },
  { key: "orders", label: "Orders", icon: "📦" },
  { key: "profile", label: "Farm profile", icon: "🏡" },
];

function Dashboard() {
  const { user, updateUser } = useAuth();
  const { toast } = useShop();
  const farmerId = user.farmerId;
  const [tab, setTab] = useState("overview");
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");
  const { data, reload } = useData(async () => ({
    products: (await getProducts({ includeHidden: true })).filter((p) => p.farmerId === farmerId),
    orders: await getOrdersForFarmer(farmerId),
  }), [farmerId]);
  const [profile, setProfile] = useState({ farmName: user.farmName || "", location: user.location || "", specialty: user.specialty || "", bio: user.bio || "", phone: user.phone || "" });

  const products = data?.products || [];
  const orders = data?.orders || [];
  const myLines = (o) => o.items.filter((i) => i.farmerId === farmerId);
  const myRevenue = (o) => myLines(o).reduce((s, i) => s + i.price * i.qty, 0);
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + myRevenue(o), 0);
  const chart = useMemo(() => revenueByDay(orders.map((o) => ({ ...o, total: myRevenue(o) }))), [orders]);

  async function save(p) {
    await saveProduct({ ...p, farmerId, farmerName: user.farmName || user.name, status: p.status || "approved", rating: p.rating || 5, reviewsCount: p.reviewsCount || 0, sold: p.sold || 0 });
    toast(p.id ? "Product updated" : "Product published 🎉");
    setEditing(null);
    reload();
  }

  async function remove(p) {
    if (!confirm(`Delete ${p.name}?`)) return;
    await removeProduct(p.id);
    toast("Product deleted", "info");
    reload();
  }

  async function saveProfile(e) {
    e.preventDefault();
    await updateUser(profile);
    toast("Farm profile saved");
  }

  return (
    <DashboardShell title={`Hello, ${user.name?.split(" ")[0]} 👋`} subtitle="Manage your farm stand, products and orders." tabs={TABS} tab={tab} setTab={setTab}
      actions={<button onClick={() => setEditing({})} className="btn-primary">＋ Publish product</button>}>
      {!data ? <p className="text-gray-500">Loading...</p> : (
        <>
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon="💰" label="Revenue" value={money(revenue)} hint="All time" />
                <StatCard icon="📦" label="Orders" value={orders.length} tone="blue" />
                <StatCard icon="🥕" label="Products" value={products.length} tone="earth" />
                <StatCard icon="⚠️" label="Low stock" value={products.filter((p) => p.stock < 20).length} tone="rose" hint="Under 20 units" />
              </div>
              <div className="card p-6">
                <h3 className="mb-4 font-semibold">Revenue — last 7 days</h3>
                <BarChart data={chart} format={money} />
              </div>
              <div className="card p-6">
                <h3 className="mb-4 font-semibold">Recent orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 4).map((o) => (
                    <div key={o.id} className="rounded-xl border p-4">
                      <div className="mb-2 flex justify-between text-sm"><b>{o.id}</b><span>{money(myRevenue(o))}</span></div>
                      <DeliveryTracker order={o} compact />
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === "products" && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b p-4">
                <input className="input max-w-xs" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
                <button onClick={() => setEditing({})} className="btn-primary">＋ New</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).map((p) => (
                      <tr key={p.id}>
                        <td className="p-3"><div className="flex items-center gap-3"><SafeImage src={p.image} className="h-10 w-10 rounded-lg object-cover" /><Link href={`/product/${p.id}`} className="font-medium hover:text-brand-700">{p.name}</Link></div></td>
                        <td className="p-3">{CATEGORIES.find((c) => c.slug === p.category)?.name}</td>
                        <td className="p-3">{money(p.price)} / {p.unit}</td>
                        <td className={`p-3 ${p.stock < 20 ? "font-semibold text-red-600" : ""}`}>{p.stock}</td>
                        <td className="p-3"><span className={`badge ${p.status === "approved" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span></td>
                        <td className="p-3 text-right">
                          <button onClick={() => setEditing(p)} className="mr-3 text-brand-700 hover:underline">Edit</button>
                          <button onClick={() => remove(p)} className="text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && <p className="p-10 text-center text-gray-500">You haven't published any products yet.</p>}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-semibold">{o.id}</p><p className="text-xs text-gray-500">{o.buyerName} · {date(o.createdAt)} · {o.address?.city}</p></div>
                    <OrderStatusBadge order={o} />
                    <p className="font-bold">{money(myRevenue(o))}</p>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {myLines(o).map((i) => <li key={i.productId}>• {i.name} × {i.qty}</li>)}
                  </ul>
                  <div className="mt-3"><DeliveryTracker order={o} compact /></div>
                </div>
              ))}
              {orders.length === 0 && <div className="card p-10 text-center text-gray-500">No orders yet.</div>}
            </div>
          )}

          {tab === "profile" && (
            <form onSubmit={saveProfile} className="card max-w-2xl space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Farm name</label><input className="input" value={profile.farmName} onChange={(e) => setProfile({ ...profile, farmName: e.target.value })} /></div>
                <div><label className="label">Location</label><input className="input" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></div>
                <div><label className="label">Specialty</label><input className="input" value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} /></div>
                <div><label className="label">Phone</label><input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              </div>
              <div><label className="label">About your farm</label><textarea className="input h-32" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
              <div className="flex gap-3"><button className="btn-primary">Save profile</button><Link href={`/farmers/${farmerId}`} className="btn-ghost">View public page →</Link></div>
            </form>
          )}
        </>
      )}
      {editing && <ProductForm initial={editing} onSave={save} onClose={() => setEditing(null)} />}
    </DashboardShell>
  );
}

export default function FarmerDashboardPage() {
  return <RequireRole roles={["farmer", "admin"]}><Dashboard /></RequireRole>;
}
