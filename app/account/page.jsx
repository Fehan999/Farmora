"use client";
import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import RequireRole from "@/components/RequireRole";
import StatCard from "@/components/StatCard";
import useData from "@/components/useData";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { getOrdersForBuyer } from "@/lib/db";
import { money } from "@/lib/format";
import { PAGE_IMAGES } from "@/data/images";
import { FARMERS } from "@/data/seed";

function Account() {
  const { user, updateUser } = useAuth();
  const { wishlist, toast } = useShop();
  const isAdmin = user.role === "admin";
  const { data: orders } = useData(() => (isAdmin ? Promise.resolve([]) : getOrdersForBuyer(user.uid)), [user.uid, isAdmin]);
  const [form, setForm] = useState({ name: user.name || "", phone: user.phone || "", location: user.location || "", bio: user.bio || "" });

  async function save(e) {
    e.preventDefault();
    await updateUser(form);
    toast("Profile updated");
  }

  const farm = user.role === "farmer" ? FARMERS.find((f) => f.id === user.farmerId) : null;
  const photo = user.avatar || user.photoURL || farm?.avatar || "";
  const spent = (orders || []).filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-4">
        <div className="card overflow-hidden text-center">
          <div className="h-20 bg-gradient-to-r from-brand-600 to-brand-800" />
          <div className="-mt-10 px-6 pb-6">
            <Avatar src={photo} name={user.name} sizes="80px" text="text-3xl" className="mx-auto h-20 w-20 border-4 border-white shadow-md" />
            <h2 className="mt-3 text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className={`badge mt-2 capitalize ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-brand-50 text-brand-700"}`}>{isAdmin ? "Administrator" : user.role}</span>
            {user.demo && <p className="mt-2 text-xs text-amber-600">Demo session</p>}
          </div>
        </div>
        {isAdmin ? (
          <div className="card space-y-3 p-6 text-sm">
            <p className="font-semibold">Marketplace admin</p>
            <p className="text-gray-500">Track platform earnings, manage products, users and farmers from the admin dashboard.</p>
            <Link href="/admin" className="btn-primary w-full">Go to admin dashboard</Link>
          </div>
        ) : (
          <>
            <StatCard icon="📦" label="Orders" value={orders?.length ?? "—"} />
            <StatCard icon="💰" label="Total spent" value={money(spent)} tone="earth" />
            <StatCard icon="♡" label="Wishlist" value={wishlist.length} tone="rose" />
            {user.role === "farmer" && <Link href="/farmer/dashboard" className="btn-primary w-full">Go to farmer dashboard</Link>}
          </>
        )}
      </div>
      <form onSubmit={save} className="card h-fit space-y-4 p-6">
        <h2 className="text-lg font-semibold">Profile settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Full name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        </div>
        <div><label className="label">Location</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div><label className="label">Bio</label><textarea className="input h-28" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        <button className="btn-primary">Save changes</button>
      </form>
    </div>
  );
}

export default function AccountPage() {
  return (
    <>
      <PageHeader title="My account" subtitle="Manage your profile, orders and saved favourites." crumbs={[{ label: "Account" }]} image={PAGE_IMAGES.account} imageAlt="Green pasture on a family dairy farm" />
      <RequireRole roles={["buyer", "farmer", "admin"]}><Account /></RequireRole>
    </>
  );
}
