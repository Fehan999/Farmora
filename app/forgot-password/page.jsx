"use client";
import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { authMessage } from "@/lib/authErrors";

export default function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try { await resetPassword(email); setMsg({ ok: true, text: "Check your inbox for a reset link." }); }
    catch (err) { setMsg({ ok: false, text: authMessage(err) }); }
  }

  return (
    <AuthShell title="Reset password" subtitle="We'll email you a link to reset it.">
      <form onSubmit={submit} className="space-y-4">
        {msg && <p className={`rounded-xl p-3 text-sm ${msg.ok ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
        <div><label className="label">Email</label><input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <button className="btn-primary w-full py-3">Send reset link</button>
      </form>
      <p className="mt-6 text-center text-sm"><Link href="/login" className="text-brand-700 hover:underline">← Back to sign in</Link></p>
    </AuthShell>
  );
}
