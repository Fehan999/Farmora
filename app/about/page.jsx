import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { SITE_IMAGES } from "@/data/images";

export const metadata = { title: "About | Farmora" };

export default function About() {
  return (
    <>
      <PageHeader title="Our story" subtitle="We started Farmora to shorten the distance between the people who grow food and the people who eat it." crumbs={[{ label: "About" }]} />
      <div className="container-x py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SafeImage src={SITE_IMAGES.about} alt="Farmers market stall" priority sizes="(max-width: 1024px) 100vw, 600px" className="h-96 w-full rounded-3xl object-cover shadow-lg" />
          <div className="space-y-4 text-gray-600">
            <h2 className="font-display text-3xl font-bold text-brand-900">Fresh food, fair trade, short journeys</h2>
            <p>Most supermarket produce travels over 1,500 miles before reaching your plate. Farmora flips that model: farmers list what they harvest, you buy directly from them, and everything arrives within 3 days.</p>
            <p>Farmers keep 85% of every sale, set their own prices and tell their own story. Buyers get transparency about where their food comes from, how it was grown and who grew it.</p>
            <Link href="/shop" className="btn-primary">Start shopping</Link>
          </div>
        </div>
        <div className="mt-16 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[["8+", "Partner farms"], ["2,500+", "Families served"], ["85%", "Goes to farmers"], ["72h", "Max delivery time"]].map(([n, l]) => (
            <div key={l} className="card p-8"><p className="text-4xl font-bold text-brand-700">{n}</p><p className="mt-1 text-gray-500">{l}</p></div>
          ))}
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[["🌱", "Sustainability", "Short supply chains, recyclable packaging and regenerative farming partners."], ["🤝", "Fairness", "Transparent pricing and fast payouts for every farmer on the platform."], ["💚", "Community", "We strengthen local food systems and the farms that keep them alive."]].map(([i, t, d]) => (
            <div key={t} className="card p-8"><span className="text-4xl">{i}</span><h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="mt-1 text-sm text-gray-500">{d}</p></div>
          ))}
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
