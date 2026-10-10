"use client";
import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { PAGE_IMAGES, SITE_IMAGES } from "@/data/images";
import { CATEGORIES } from "@/data/seed";

const HELP_IMAGE = SITE_IMAGES.heroSecondary || PAGE_IMAGES.categories || CATEGORIES[1].image;

const FAQS = [
  ["How long does delivery take?", "Every order is delivered within 3 days (72 hours). You can follow each step live from your order page: placed, packed, shipped, out for delivery and delivered."],
  ["Is delivery free?", "Delivery is free on orders over $50. Smaller orders have a flat $4.99 delivery fee."],
  ["Can I cancel my order?", "Yes, you can cancel from your order page any time before it ships (within the first 24 hours)."],
  ["How do I become a seller?", "Create an account and choose “I want to sell”. You can publish products with photos straight away from your farmer dashboard."],
  ["Are all products organic?", "Many are. Look for the Organic badge on each product, or use the Organic filter in the shop."],
  ["Which payment methods are accepted?", "Credit/debit card and cash on delivery."],
  ["Do you have discount codes?", "Try FRESH10 for 10% off, WELCOME5 for 5% off, or FARMORA20 for 20% off during harvest deals."],
  ["What if something arrives damaged?", "Contact us within 48 hours with a photo and we'll refund or replace it under our freshness guarantee."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHeader title="Frequently asked questions" subtitle="Everything you need to know about ordering, delivery and selling on Farmora." crumbs={[{ label: "FAQ" }]} image={PAGE_IMAGES.faq} imageAlt="Fresh herbs growing in a greenhouse" />
      <div className="container-x max-w-3xl space-y-3 py-12">
        {FAQS.map(([q, a], i) => (
          <div key={q} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between p-5 text-left font-semibold">
              {q}<span className="text-xl text-brand-600">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="px-5 pb-5 text-gray-600">{a}</p>}
          </div>
        ))}
        <div className="card mt-8 grid overflow-hidden sm:grid-cols-[200px_1fr]">
          <div className="h-40 bg-gradient-to-br from-brand-500 to-brand-700 sm:h-full">
            {HELP_IMAGE && <SafeImage src={HELP_IMAGE} alt="Basket of fresh farm produce" sizes="(max-width: 640px) 92vw, 200px" className="h-full w-full object-cover" />}
          </div>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-brand-900">Still have questions?</h2>
            <p className="mt-1 text-sm text-gray-500">Our support team and farmers reply within 24 hours, Monday to Saturday.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Contact us</Link>
              <Link href="/track" className="btn-outline">Track an order</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
