"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Spinner from "@/components/Spinner";
import useData from "@/components/useData";
import { getProducts, getFarmers } from "@/lib/db";
import { useShop } from "@/context/ShopContext";
import { PRODUCTS } from "@/data/seed";
import { PAGE_IMAGES } from "@/data/images";

const PICKS = ["p25", "p10", "p18"].map((id) => PRODUCTS.find((p) => p.id === id)).filter((p) => p?.image);
const TILT = ["left-0 -rotate-6", "left-14 z-10 -translate-y-2", "left-28 rotate-6"];

export default function Wishlist() {
  const { wishlist, ready } = useShop();
  const { data } = useData(async () => ({ products: await getProducts(), farmers: await getFarmers() }));
  const items = (data?.products || []).filter((p) => wishlist.includes(p.id));

  return (
    <>
      <PageHeader title="Wishlist" subtitle="Products you've saved for later." crumbs={[{ label: "Wishlist" }]} image={PAGE_IMAGES.wishlist} imageAlt="Jars of raw honey from a local apiary" />
      <div className="container-x py-10">
        {!ready || (!data && wishlist.length > 0) ? (
          <div className="grid min-h-[40vh] place-items-center py-16"><Spinner size={48} label="Loading your wishlist..." /></div>
        ) : items.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="relative mx-auto h-28 w-56">
              {PICKS.map((p, n) => (
                <SafeImage key={p.id} src={p.image} alt={p.name} sizes="112px" className={`absolute top-0 h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg ${TILT[n]}`} />
              ))}
              <span className="absolute -bottom-3 left-1/2 z-20 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-white text-2xl text-red-500 shadow-md">♥</span>
            </div>
            <h2 className="mt-8 text-xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-1 text-gray-500">Tap the heart on any product to save it for later.</p>
            <Link href="/shop" className="btn-primary mt-6">Discover products</Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} farmer={data.farmers.find((f) => f.id === p.farmerId)} />)}
          </div>
        )}
      </div>
    </>
  );
}
