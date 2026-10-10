"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/farmers", label: "Farmers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useShop();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");

  const dashboard = user?.role === "admin" ? "/admin" : user?.role === "farmer" ? "/farmer/dashboard" : "/account";

  function search(e) {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="bg-brand-800 py-1.5 text-center text-xs font-medium text-brand-50">
        🚚 Free delivery on orders over $50 · Every order arrives within 3 days · Use code <b>FRESH10</b> for 10% off
      </div>
      <div className="container-x flex h-16 items-center gap-4">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${pathname === l.href ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:text-brand-700"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={search} className="ml-auto hidden max-w-xs flex-1 md:block">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fresh produce..." className="input rounded-full bg-gray-50 py-2" />
        </form>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href="/wishlist" className="relative rounded-full p-2 text-xl hover:bg-gray-100" title="Wishlist">
            ♡{wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-earth-500 text-[10px] font-bold text-white">{wishlist.length}</span>}
          </Link>
          <Link href="/cart" className="relative rounded-full p-2 text-xl hover:bg-gray-100" title="Cart">
            🛒{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">{cartCount}</span>}
          </Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 hover:bg-gray-50">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">{user.name?.[0]?.toUpperCase()}</span>
                <span className="hidden text-sm font-medium sm:block">{user.name?.split(" ")[0]}</span>
              </button>
              {menu && (
                <div onMouseLeave={() => setMenu(false)} className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">
                  <div className="border-b px-4 pb-2">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs capitalize text-gray-500">{user.role} account</p>
                  </div>
                  <Link onClick={() => setMenu(false)} href={dashboard} className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                  <Link onClick={() => setMenu(false)} href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                  <Link onClick={() => setMenu(false)} href="/account" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile Settings</Link>
                  <button onClick={() => { logout(); setMenu(false); router.push("/"); }} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary ml-1 hidden sm:inline-flex">Sign in</Link>
          )}
          <button onClick={() => setOpen(!open)} className="rounded-full p-2 text-2xl lg:hidden">☰</button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-white lg:hidden">
          <div className="container-x space-y-1 py-3">
            <form onSubmit={search}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="input mb-2" /></form>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50">{l.label}</Link>
            ))}
            {!user && <Link href="/login" onClick={() => setOpen(false)} className="btn-primary w-full">Sign in</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
