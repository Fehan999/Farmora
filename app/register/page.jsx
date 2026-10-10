"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { authMessage } from "@/lib/authErrors";

function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: params.get("role") === "farmer" ? "farmer" : "buyer", farmName: "", location: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setBusy(true); setError("");
    try {
      await register(form);
      router.push(form.role === "farmer" ? "/farmer/dashboard" : "/shop");
    } catch (err) { setError(authMessage(err)); }
    setBusy(false);
  }

  return (
    <AuthShell title="Create your account" subtitle="Join as a buyer or open your farm stand.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[["buyer", "🛍️", "I want to buy"], ["farmer", "🧑‍🌾", "I want to sell"]].map(([r, i, l]) => (
            <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
              className={`rounded-xl border-2 p-4 text-center ${form.role === r ? "border-brand-600 bg-brand-50" : "border-gray-100 bg-white"}`}>
              <div className="text-2xl">{i}</div><div className="text-sm font-semibold">{l}</div>
            </button>
          ))}
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div><label className="label">Full name</label><input required className="input" value={form.name} onChange={set("name")} /></div>
        {form.role === "farmer" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Farm name</label><input required className="input" value={form.farmName} onChange={set("farmName")} /></div>
            <div><label className="label">Location</label><input required className="input" placeholder="City, State" value={form.location} onChange={set("location")} /></div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Email</label><input type="email" required className="input" value={form.email} onChange={set("email")} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set("phone")} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Password</label><input type="password" minLength={6} required className="input" value={form.password} onChange={set("password")} /></div>
          <div><label className="label">Confirm</label><input type="password" required className="input" value={form.confirm} onChange={set("confirm")} /></div>
        </div>
        <label className="flex items-start gap-2 text-xs text-gray-500"><input required type="checkbox" className="mt-0.5 accent-brand-600" /> I agree to the <Link href="/terms" className="text-brand-700 underline">Terms</Link> and <Link href="/privacy" className="text-brand-700 underline">Privacy Policy</Link>.</label>
        <button disabled={busy} className="btn-primary w-full py-3">{busy ? "Creating account..." : "Create account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return <Suspense><Register /></Suspense>;
}
