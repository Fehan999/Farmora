"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { startNav } from "./RouteProgress";
import { ROLES, destinationFor } from "./authRoles";

export function Spinner({ className = "" }) {
  return <span aria-hidden="true" className={`inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />;
}

export default function DemoButton({ role, next = "", label, className = "btn-primary w-full py-3", disabled = false, onStart, onFail }) {
  const { demoLogin } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const to = destinationFor(role, next);
  const r = ROLES[role];

  useEffect(() => { router.prefetch(to); }, [router, to]);

  async function go() {
    setBusy(true);
    onStart?.();
    try {
      await demoLogin(role);
      startNav(to);
      router.push(to);
    } catch {
      setBusy(false);
      onFail?.();
    }
  }

  return (
    <button type="button" onClick={go} disabled={busy || disabled} aria-busy={busy} className={className}>
      {busy ? <Spinner /> : <span aria-hidden="true">{r.icon}</span>}
      {busy ? "Opening demo..." : label || `View demo ${r.label.toLowerCase()} account`}
    </button>
  );
}
