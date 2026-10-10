"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const roles = [
  { role: "admin", label: "Admin", icon: "🛡️", to: "/admin", desc: "Full dashboard" },
  { role: "farmer", label: "Farmer", icon: "🧑‍🌾", to: "/farmer/dashboard", desc: "Sell products" },
  { role: "buyer", label: "Buyer", icon: "🛍️", to: "/shop", desc: "Shop & track" },
];

export default function DemoLogins() {
  const { demoLogin } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState("");

  async function go(r) {
    setBusy(r.role);
    await demoLogin(r.role);
    router.push(r.to);
  }

  return (
    <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-4">
      <p className="mb-3 text-center text-sm font-semibold text-brand-800">⚡ Explore instantly with a demo account</p>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => (
          <button key={r.role} type="button" onClick={() => go(r)} disabled={!!busy}
            className="rounded-xl bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:opacity-60">
            <div className="text-2xl">{r.icon}</div>
            <div className="text-sm font-semibold">{busy === r.role ? "..." : r.label}</div>
            <div className="text-[10px] text-gray-500">{r.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
