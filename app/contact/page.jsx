"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { PAGE_IMAGES, SITE_IMAGES } from "@/data/images";
import { CATEGORIES } from "@/data/seed";
import { sendContactMessage } from "@/lib/db";

const HUB_IMAGE = SITE_IMAGES.about || PAGE_IMAGES.shop || CATEGORIES[0].image;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    await sendContactMessage(form);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <>
      <PageHeader title="Contact us" subtitle="Questions, feedback or want to partner with us? We'd love to hear from you." crumbs={[{ label: "Contact" }]} image={PAGE_IMAGES.contact} imageAlt="Sunlit orchard on a Farmora partner farm" />
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          {[["📍", "Visit", "221 Harvest Lane, Portland, OR 97201"], ["📞", "Call", "+1 (503) 555-0100"], ["✉️", "Email", "hello@farmora.com"], ["🕘", "Hours", "Mon – Sat, 8am – 6pm"]].map(([i, t, d]) => (
            <div key={t} className="card flex items-center gap-4 p-5"><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{i}</span><div><p className="font-semibold">{t}</p><p className="text-sm text-gray-500">{d}</p></div></div>
          ))}
          <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm">
            {HUB_IMAGE && <SafeImage src={HUB_IMAGE} alt="Fresh produce at the Farmora Portland hub" sizes="(max-width: 1024px) 92vw, 400px" className="h-48 w-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-semibold">Saturday farmers market</p>
              <p className="text-sm text-brand-100">Meet our growers in person at the Portland hub, 9am – 1pm.</p>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6">
          {sent && <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Thanks! Your message has been sent. We'll reply within 24 hours.</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Name</label><input required className="input" value={form.name} onChange={set("name")} /></div>
            <div><label className="label">Email</label><input required type="email" className="input" value={form.email} onChange={set("email")} /></div>
          </div>
          <div><label className="label">Subject</label><input required className="input" value={form.subject} onChange={set("subject")} /></div>
          <div><label className="label">Message</label><textarea required className="input h-40" value={form.message} onChange={set("message")} /></div>
          <button className="btn-primary">Send message</button>
        </form>
      </div>
    </>
  );
}
