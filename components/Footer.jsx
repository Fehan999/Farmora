"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { subscribeNewsletter } from "@/lib/db";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email) return;
    await subscribeNewsletter(email);
    setDone(true);
    setEmail("");
  }

  return (
    <footer className="mt-20 bg-brand-900 text-brand-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-brand-200">From Local Farms to Your Door. Farmora connects families with independent farmers for fresher food, fair prices and a healthier planet.</p>
          <form onSubmit={submit} className="mt-6 flex max-w-sm gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="input border-brand-700 bg-brand-800 text-white placeholder:text-brand-300" />
            <button className="btn bg-earth-500 text-white hover:bg-earth-600">Join</button>
          </form>
          {done && <p className="mt-2 text-xs text-brand-300">Thanks for subscribing! 🌿</p>}
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-white">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link href="/shop?sort=discount" className="hover:text-white">Deals</Link></li>
            <li><Link href="/farmers" className="hover:text-white">Our Farmers</Link></li>
            <li><Link href="/track" className="hover:text-white">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/sell" className="hover:text-white">Sell on Farmora</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-white">Shipping & Returns</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-300 sm:flex-row">
          <p>© {new Date().getFullYear()} Farmora. All rights reserved.</p>
          <p>Designed & Developed by <span className="font-semibold text-earth-400">Ehan Siddique</span></p>
        </div>
      </div>
    </footer>
  );
}
