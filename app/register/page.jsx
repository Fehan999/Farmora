"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import DemoButton, { Spinner } from "@/components/DemoButton";
import { ROLES, destinationFor, normalizeRole, safeNext } from "@/components/authRoles";
import { useAuth } from "@/context/AuthContext";
import { authMessage } from "@/lib/authErrors";

function Register({ roleParam = null, nextParam = null }) {
  const { register } = useAuth();
  const router = useRouter();
  const next = safeNext(nextParam);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: normalizeRole(roleParam) === "farmer" ? "farmer" : "buyer", farmName: "", location: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const label = ROLES[form.role].label.toLowerCase();
  const query = next ? `&next=${encodeURIComponent(next)}` : "";

  async function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setBusy(true); setError("");
    try {
      await register(form);
      router.push(destinationFor(form.role, next));
    } catch (err) {
      setError(authMessage(err)); setBusy(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join as a buyer or open your farm stand.">
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/70 p-4 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-snug"><span className="font-semibold text-brand-900">Just exploring?</span> <span className="text-gray-600">Look around with a ready-made account.</span></p>
        <DemoButton role={form.role} next={next} disabled={busy} label={`View the demo ${label} account`} className="btn-outline shrink-0 bg-white px-4 py-2 text-xs" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[["buyer", "🛍️", "I want to buy"], ["farmer", "🧑‍🌾", "I want to sell"]].map(([r, i, l]) => (
            <button type="button" key={r} onClick={() => setForm({ ...form, role: r })} aria-pressed={form.role === r}
              className={`rounded-xl border-2 p-4 text-center transition ${form.role === r ? "border-brand-600 bg-brand-50" : "border-gray-100 bg-white hover:border-brand-200"}`}>
              <div aria-hidden="true" className="text-2xl">{i}</div><div className="text-sm font-semibold">{l}</div>
            </button>
          ))}
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div><label htmlFor="reg-name" className="label">Full name</label><input id="reg-name" autoComplete="name" required className="input" value={form.name} onChange={set("name")} /></div>
        {form.role === "farmer" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="reg-farm" className="label">Farm name</label><input id="reg-farm" autoComplete="organization" required className="input" value={form.farmName} onChange={set("farmName")} /></div>
            <div><label htmlFor="reg-location" className="label">Location</label><input id="reg-location" required className="input" placeholder="City, State" value={form.location} onChange={set("location")} /></div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="reg-email" className="label">Email</label><input id="reg-email" type="email" autoComplete="email" required className="input" value={form.email} onChange={set("email")} /></div>
          <div><label htmlFor="reg-phone" className="label">Phone</label><input id="reg-phone" type="tel" autoComplete="tel" className="input" value={form.phone} onChange={set("phone")} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="reg-password" className="label">Password</label><input id="reg-password" type="password" autoComplete="new-password" minLength={6} required className="input" value={form.password} onChange={set("password")} /></div>
          <div><label htmlFor="reg-confirm" className="label">Confirm</label><input id="reg-confirm" type="password" autoComplete="new-password" required className="input" value={form.confirm} onChange={set("confirm")} /></div>
        </div>
        <label className="flex items-start gap-2 text-xs text-gray-500"><input required type="checkbox" className="mt-0.5 accent-brand-600" /> <span>I agree to the <Link href="/terms" className="text-brand-700 underline">Terms</Link> and <Link href="/privacy" className="text-brand-700 underline">Privacy Policy</Link>.</span></label>
        <button disabled={busy} className="btn-primary w-full py-3">{busy ? <><Spinner /> Creating account...</> : `Create ${label} account`}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link href={`/login?role=${form.role}${query}`} className="font-semibold text-brand-700 hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}

function RegisterFromParams() {
  const params = useSearchParams();
  return <Register roleParam={params.get("role")} nextParam={params.get("next")} />;
}

export default function RegisterPage() {
  return <Suspense fallback={<Register />}><RegisterFromParams /></Suspense>;
}
