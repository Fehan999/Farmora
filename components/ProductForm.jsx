"use client";
import { useState } from "react";
import SafeImage from "./SafeImage";
import { CATEGORIES } from "@/data/seed";
import { uploadImage } from "@/lib/supabase";

const empty = { name: "", category: "vegetables", price: "", unit: "lb", stock: "", discount: 0, organic: true, description: "", image: "", gallery: [] };

export default function ProductForm({ initial, onSave, onClose, farms }) {
  const [form, setForm] = useState(() => {
    const base = { ...empty, ...initial };
    if (farms?.length && !base.farmerId) base.farmerId = farms[0].id;
    return base;
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function onFiles(e) {
    const files = [...e.target.files];
    if (!files.length) return;
    setUploading(true); setError("");
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f)));
      setForm((f) => ({ ...f, image: f.image || urls[0], gallery: [...(f.gallery || []), ...urls] }));
    } catch (err) {
      setError(`Upload failed: ${err.message}. Check that the "farmora" bucket is public and allows uploads.`);
    }
    setUploading(false);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.image) { setError("Please upload at least one image or paste an image URL."); return; }
    onSave({
      ...form,
      price: +form.price, stock: +form.stock, discount: +form.discount || 0,
      gallery: form.gallery?.length ? form.gallery : [form.image],
    });
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{initial?.id ? "Edit product" : "Publish a new product"}</h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-400">×</button>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div>
          <label className="label">Product images</label>
          <div className="flex flex-wrap gap-3">
            {(form.gallery || []).map((g) => (
              <div key={g} className="relative">
                <SafeImage src={g} className={`h-20 w-20 rounded-xl object-cover ${form.image === g ? "ring-2 ring-brand-600" : ""}`} />
                <button type="button" onClick={() => setForm({ ...form, image: g })} className="absolute bottom-1 left-1 rounded bg-white/90 px-1 text-[10px]">Cover</button>
                <button type="button" onClick={() => setForm({ ...form, gallery: form.gallery.filter((x) => x !== g), image: form.image === g ? "" : form.image })} className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs text-white">×</button>
              </div>
            ))}
            <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-gray-300 text-center text-xs text-gray-500 hover:border-brand-500">
              {uploading ? "Uploading..." : "＋ Upload"}
              <input type="file" accept="image/*" multiple hidden onChange={onFiles} />
            </label>
          </div>
          <input className="input mt-2" placeholder="...or paste an image URL" value={form.image} onChange={set("image")} />
        </div>
        {farms && (
          <div>
            <label className="label" htmlFor="product-farm">Farm</label>
            <select id="product-farm" required className="input" value={form.farmerId || ""} onChange={set("farmerId")}>
              {form.farmerId && !farms.some((f) => f.id === form.farmerId) && <option value={form.farmerId}>{form.farmerName || form.farmerId}</option>}
              {farms.map((f) => <option key={f.id} value={f.id}>{f.name}{f.location ? ` · ${f.location}` : ""}</option>)}
            </select>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="product-name" className="label">Name</label><input id="product-name" required className="input" value={form.name} onChange={set("name")} /></div>
          <div>
            <label htmlFor="product-category" className="label">Category</label>
            <select id="product-category" className="input" value={form.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
          </div>
          <div><label htmlFor="product-price" className="label">Price ($)</label><input id="product-price" required type="number" step="0.01" min="0" className="input" value={form.price} onChange={set("price")} /></div>
          <div><label htmlFor="product-unit" className="label">Unit</label><input id="product-unit" required className="input" placeholder="lb, dozen, bunch" value={form.unit} onChange={set("unit")} /></div>
          <div><label htmlFor="product-stock" className="label">Stock</label><input id="product-stock" required type="number" min="0" className="input" value={form.stock} onChange={set("stock")} /></div>
          <div><label htmlFor="product-discount" className="label">Discount (%)</label><input id="product-discount" type="number" min="0" max="90" className="input" value={form.discount} onChange={set("discount")} /></div>
        </div>
        <div><label htmlFor="product-description" className="label">Description</label><textarea id="product-description" required className="input h-28" value={form.description} onChange={set("description")} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.organic} onChange={set("organic")} className="accent-brand-600" /> Certified organic</label>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button disabled={uploading} className="btn-primary">{initial?.id ? "Save changes" : "Publish product"}</button>
        </div>
      </form>
    </div>
  );
}
