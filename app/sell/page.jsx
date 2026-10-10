import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { SITE_IMAGES } from "@/data/images";

export const metadata = { title: "Sell on Farmora" };

export default function Sell() {
  return (
    <>
      <PageHeader title="Sell on Farmora" subtitle="Open your digital farm stand and reach thousands of local families." crumbs={[{ label: "Sell" }]} />
      <div className="container-x py-12">
        <div className="relative mb-10 overflow-hidden rounded-3xl">
          <SafeImage src={SITE_IMAGES.sell} alt="Farmer working in a vegetable field" priority sizes="(max-width: 1280px) 100vw, 1200px" className="h-64 w-full object-cover sm:h-80" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-900/80 to-transparent p-8">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Grow it. List it. We deliver it.</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[["💸", "Keep 85%", "Low, transparent fees and weekly payouts."], ["📸", "Easy listings", "Upload photos and publish a product in under a minute."], ["📊", "Smart dashboard", "Track revenue, orders and stock in one place."]].map(([i, t, d]) => (
            <div key={t} className="card p-8 text-center"><span className="text-5xl">{i}</span><h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="mt-1 text-sm text-gray-500">{d}</p></div>
          ))}
        </div>
        <div className="mt-12 card p-8">
          <h2 className="font-display text-2xl font-bold text-brand-900">How to get started</h2>
          <ol className="mt-4 space-y-3 text-gray-600">
            <li>1. Create a farmer account with your farm name and location.</li>
            <li>2. Publish your products with photos, prices and stock.</li>
            <li>3. Receive orders and pack them within 6 hours.</li>
            <li>4. Our couriers deliver to buyers within 3 days.</li>
          </ol>
          <div className="mt-6 flex gap-3"><Link href="/register?role=farmer" className="btn-primary">Create farmer account</Link><Link href="/login" className="btn-outline">Try demo farmer</Link></div>
        </div>
      </div>
    </>
  );
}
