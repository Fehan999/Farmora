import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import Avatar from "@/components/Avatar";
import { SITE_IMAGES, PAGE_IMAGES } from "@/data/images";
import { CATEGORIES, FARMERS } from "@/data/seed";

const STORY_IMAGE = SITE_IMAGES.about || PAGE_IMAGES.shop || CATEGORIES[0].image;
const VALUES = [
  ["🌱", "Sustainability", "Short supply chains, recyclable packaging and regenerative farming partners.", "vegetables"],
  ["🤝", "Fairness", "Transparent pricing and fast payouts for every farmer on the platform.", "fruits"],
  ["💚", "Community", "We strengthen local food systems and the farms that keep them alive.", "bakery"],
].map(([i, t, d, slug]) => [i, t, d, CATEGORIES.find((c) => c.slug === slug)?.image || ""]);

export const metadata = { title: "About Farmora — Built by Ehan Siddique", description: "Farmora is a farm-to-table marketplace designed and developed by Ehan Siddique, connecting verified local farmers with buyers through fresh 3-day delivery.", alternates: { canonical: "/about" }, openGraph: { type: "website", siteName: "Farmora", locale: "en_US", url: "/about", title: "About Farmora — Built by Ehan Siddique", description: "Farmora is a farm-to-table marketplace designed and developed by Ehan Siddique, connecting verified local farmers with buyers through fresh 3-day delivery.", images: ["/opengraph-image"] }, twitter: { card: "summary_large_image", title: "About Farmora — Built by Ehan Siddique", description: "Farmora is a farm-to-table marketplace designed and developed by Ehan Siddique, connecting verified local farmers with buyers through fresh 3-day delivery.", creator: "Ehan Siddique", images: ["/twitter-image"] } };

export default function About() {
  return (
    <>
      <PageHeader title="Our story" subtitle="We started Farmora to shorten the distance between the people who grow food and the people who eat it." crumbs={[{ label: "About" }]} image={PAGE_IMAGES.about} imageAlt="Local farmers market stall full of fresh produce" />
      <div className="container-x py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
            {STORY_IMAGE && <SafeImage src={STORY_IMAGE} alt="Farmers market stall" sizes="(max-width: 1024px) 92vw, 600px" className="h-80 w-full object-cover sm:h-96" />}
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
              <span className="text-2xl">🧺</span>
              <div><p className="text-sm font-bold text-gray-800">Farm to door</p><p className="text-xs text-gray-500">in 72 hours or less</p></div>
            </div>
          </div>
          <div className="space-y-4 text-gray-600">
            <h2 className="font-display text-3xl font-bold text-brand-900">Fresh food, fair trade, short journeys</h2>
            <p>Most supermarket produce travels over 1,500 miles before reaching your plate. Farmora flips that model: farmers list what they harvest, you buy directly from them, and everything arrives within 3 days.</p>
            <p>Farmers keep 90% of every sale, set their own prices and tell their own story. Buyers get transparency about where their food comes from, how it was grown and who grew it.</p>
            <Link href="/shop" className="btn-primary">Start shopping</Link>
          </div>
        </div>
        <div className="mt-16 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[["8+", "Partner farms"], ["2,500+", "Families served"], ["90%", "Goes to farmers"], ["72h", "Max delivery time"]].map(([n, l]) => (
            <div key={l} className="card p-8"><p className="text-4xl font-bold text-brand-700">{n}</p><p className="mt-1 text-gray-500">{l}</p></div>
          ))}
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {VALUES.map(([i, t, d, img]) => (
            <div key={t} className="card overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-brand-500 to-brand-700">
                {img && <SafeImage src={img} alt={`${t} at Farmora`} sizes="(max-width: 768px) 92vw, 400px" className="h-full w-full object-cover" />}
                <span className="absolute -bottom-6 left-6 grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-md">{i}</span>
              </div>
              <div className="p-6 pt-9"><h3 className="text-lg font-semibold">{t}</h3><p className="mt-1 text-sm text-gray-500">{d}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-16 card p-8 text-center">
          <p className="font-semibold text-earth-600">The people who grow your food</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-brand-900">Meet our growers</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {FARMERS.map((f) => (
              <Link key={f.id} href={`/farmers/${f.id}`} className="group w-24 text-center">
                <Avatar src={f.avatar} name={f.owner} sizes="80px" text="text-xl" className="mx-auto h-20 w-20 ring-4 ring-brand-50 transition group-hover:ring-brand-200" />
                <p className="mt-2 truncate text-sm font-semibold group-hover:text-brand-700">{f.owner}</p>
                <p className="truncate text-xs text-gray-500">{f.name}</p>
              </Link>
            ))}
          </div>
          <Link href="/farmers" className="btn-outline mt-8">See all farms</Link>
        </div>
        <div className="mt-16 rounded-3xl bg-brand-800 p-10 text-center text-white">
          <p className="text-sm uppercase tracking-widest text-brand-300">The person behind Farmora</p>
          <h3 className="mt-2 font-display text-3xl font-bold">Designed & Developed by Ehan Siddique</h3>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">Built with Next.js, React, Tailwind CSS, Firebase and Supabase as a full-stack marketplace connecting farmers and families.</p>
        </div>
      </div>
    </>
  );
}
