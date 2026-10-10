import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import Avatar from "@/components/Avatar";
import { SITE_IMAGES, PAGE_IMAGES } from "@/data/images";
import { CATEGORIES, FARMERS } from "@/data/seed";

const BANNER = SITE_IMAGES.sell || PAGE_IMAGES.farmers || CATEGORIES[0].image;
const START_IMAGE = PAGE_IMAGES.farmers || SITE_IMAGES.heroSecondary || CATEGORIES[1].image;
const MENTOR = FARMERS[0];

export const metadata = { title: "Sell Your Farm Produce Online", description: "Sell your harvest directly to local buyers on Farmora. List products in minutes, manage orders from your farmer dashboard and keep 90% of every sale.", alternates: { canonical: "/sell" }, openGraph: { type: "website", siteName: "Farmora", locale: "en_US", url: "/sell", title: "Sell Your Farm Produce Online", description: "Sell your harvest directly to local buyers on Farmora. List products in minutes, manage orders from your farmer dashboard and keep 90% of every sale.", images: ["/opengraph-image"] }, twitter: { card: "summary_large_image", title: "Sell Your Farm Produce Online", description: "Sell your harvest directly to local buyers on Farmora. List products in minutes, manage orders from your farmer dashboard and keep 90% of every sale.", creator: "Ehan Siddique", images: ["/twitter-image"] } };

export default function Sell() {
  return (
    <>
      <PageHeader title="Sell on Farmora" subtitle="Open your digital farm stand and reach thousands of local families." crumbs={[{ label: "Sell" }]} image={PAGE_IMAGES.sell} imageAlt="Farmer harvesting crops in the field" />
      <div className="container-x py-12">
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800">
          {BANNER ? <SafeImage src={BANNER} alt="Farmer working in a vegetable field" sizes="(max-width: 1280px) 100vw, 1200px" className="h-64 w-full object-cover sm:h-80" /> : <div className="h-64 sm:h-80" />}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-900/80 to-transparent p-8">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Grow it. List it. We deliver it.</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[["💸", "Keep 90%", "Just a 10% platform fee, with weekly payouts."], ["📸", "Easy listings", "Upload photos and publish a product in under a minute."], ["📊", "Smart dashboard", "Track revenue, orders and stock in one place."]].map(([i, t, d]) => (
            <div key={t} className="card p-8 text-center"><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-5xl">{i}</span><h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="mt-1 text-sm text-gray-500">{d}</p></div>
          ))}
        </div>
        <div className="mt-12 card grid overflow-hidden lg:grid-cols-2">
          <div className="p-8">
            <h2 className="font-display text-2xl font-bold text-brand-900">How to get started</h2>
            <ol className="mt-4 space-y-3 text-gray-600">
              <li>1. Create a farmer account with your farm name and location.</li>
              <li>2. Publish your products with photos, prices and stock.</li>
              <li>3. Receive orders and pack them within 6 hours.</li>
              <li>4. Our couriers deliver to buyers within 3 days.</li>
            </ol>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/register?role=farmer" className="btn-primary">Create farmer account</Link><Link href="/login" className="btn-outline">Try demo farmer</Link></div>
          </div>
          <div className="relative min-h-[16rem] bg-gradient-to-br from-brand-500 to-brand-700">
            {START_IMAGE && <SafeImage src={START_IMAGE} alt="Fresh harvest ready to be listed on Farmora" sizes="(max-width: 1024px) 92vw, 600px" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-lg">
              <Avatar src={MENTOR.avatar} name={MENTOR.owner} sizes="48px" className="h-12 w-12" />
              <div className="min-w-0 text-sm">
                <p className="text-gray-700">“Farmora lets us sell straight to families and get paid every week.”</p>
                <p className="mt-0.5 text-xs font-semibold text-brand-800">{MENTOR.owner}, {MENTOR.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
