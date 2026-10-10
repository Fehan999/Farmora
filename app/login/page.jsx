"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import DemoLogins from "@/components/DemoLogins";
import { useAuth } from "@/context/AuthContext";
import { authMessage } from "@/lib/authErrors";

function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try { await login(form.email, form.password); router.push(next); }
    catch (err) { setError(authMessage(err)); }
    setBusy(false);
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Farmora account.">
      <DemoLogins />
      <div className="my-6 flex items-center gap-3 text-xs text-gray-400"><div className="h-px flex-1 bg-gray-200" /> or sign in with email <div className="h-px flex-1 bg-gray-200" /></div>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div><label className="label">Email</label><input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div>
          <div className="flex justify-between"><label className="label">Password</label><Link href="/forgot-password" className="text-xs text-brand-700 hover:underline">Forgot password?</Link></div>
          <div className="relative">
            <input type={show ? "text" : "password"} required className="input pr-16" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-xs text-gray-500">{show ? "Hide" : "Show"}</button>
          </div>
        </div>
        <button disabled={busy} className="btn-primary w-full py-3">{busy ? "Signing in..." : "Sign in"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">New to Farmora? <Link href="/register" className="font-semibold text-brand-700 hover:underline">Create an account</Link></p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><Login /></Suspense>;
}
