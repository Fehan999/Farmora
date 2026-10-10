"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import useData from "@/components/useData";
import { getProducts, getFarmers } from "@/lib/db";
import { useShop } from "@/context/ShopContext";

export default function Wishlist() {
  const { wishlist } = useShop();
  const { data } = useData(async () => ({ products: await getProducts(), farmers: await getFarmers() }));
  const items = (data?.products || []).filter((p) => wishlist.includes(p.id));

  return (
    <>
      <PageHeader title="Wishlist" subtitle="Products you've saved for later." crumbs={[{ label: "Wishlist" }]} />
      <div className="container-x py-10">
        {items.length === 0 ? (
          <div className="card py-20 text-center"><div className="text-6xl">♡</div><h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2><Link href="/shop" className="btn-primary mt-6">Discover products</Link></div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} farmer={data.farmers.find((f) => f.id === p.farmerId)} />)}
          </div>
        )}
      </div>
    </>
  );
}
