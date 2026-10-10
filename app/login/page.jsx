"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import DemoButton, { Spinner } from "@/components/DemoButton";
import RoleChooser from "@/components/RoleChooser";
import { ROLES, dashboardFor, normalizeRole, safeNext } from "@/components/authRoles";
import { useAuth } from "@/context/AuthContext";
import { authMessage } from "@/lib/authErrors";

function SignInForm({ to, disabled, onStart, onFail }) {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(""); onStart();
    try {
      await login(form.email.trim(), form.password);
      router.push(to);
    } catch (err) {
      setError(authMessage(err)); setBusy(false); onFail();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div>
        <label htmlFor="login-email" className="label">Email</label>
        <input id="login-email" type="email" autoComplete="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="label">Password</label>
          <Link href="/forgot-password" className="mb-1.5 text-xs font-medium text-brand-700 hover:underline">Forgot password?</Link>
        </div>
        <div className="relative">
          <input id="login-password" type={show ? "text" : "password"} autoComplete="current-password" required className="input pr-16" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}
            className="absolute inset-y-0 right-0 rounded-r-xl px-4 text-xs font-medium text-gray-500 transition hover:text-brand-700">{show ? "Hide" : "Show"}</button>
        </div>
      </div>
      <button disabled={busy || disabled} className="btn w-full bg-brand-800 py-3 text-white hover:bg-brand-900">
        {busy ? <><Spinner /> Signing in...</> : "Sign in"}
      </button>
    </form>
  );
}

function SignedIn({ user, logout }) {
  const r = ROLES[normalizeRole(user.role) || "buyer"];
  return (
    <div className="animate-slide-up">
      <div className="card flex items-center gap-4 p-5">
        <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-800">{(user.name || "?")[0].toUpperCase()}</span>
        <div className="min-w-0">
          <p className="truncate text-sm text-gray-500">You're signed in as <span className="font-semibold text-brand-900">{user.name}</span></p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{r.icon} {user.demo ? `Demo ${r.label.toLowerCase()} account` : user.email}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href={dashboardFor(user.role)} className="btn-primary py-3">Go to dashboard</Link>
        <button type="button" onClick={logout} className="btn-ghost border border-gray-200 py-3">Sign out</button>
      </div>
    </div>
  );
}

function Login({ roleParam = null, nextParam = null }) {
  const { user, logout } = useAuth();
  const next = safeNext(nextParam);
  const initial = normalizeRole(roleParam) || (next ? "buyer" : null);
  const [role, setRole] = useState(initial);
  const [leaving, setLeaving] = useState(false);
  const [adminForm, setAdminForm] = useState(false);

  useEffect(() => { setRole(initial); }, [initial]);

  if (user && !leaving) {
    return (
      <AuthShell title="Welcome back" subtitle="Pick up right where you left off.">
        <SignedIn user={user} logout={logout} />
      </AuthShell>
    );
  }

  if (!role) {
    return (
      <AuthShell title="Welcome to Farmora" subtitle="How would you like to continue?">
        <div className="animate-slide-up">
          <RoleChooser onPick={setRole} />
          <p className="mt-6 text-center text-sm text-gray-500">Already have an account? Pick your role above to sign in.</p>
        </div>
      </AuthShell>
    );
  }

  const r = ROLES[role];
  const flow = { disabled: leaving, onStart: () => setLeaving(true), onFail: () => setLeaving(false) };
  const query = next ? `&next=${encodeURIComponent(next)}` : "";
  const top = (
    <div className="mb-5 flex items-center justify-between gap-3">
      <button type="button" disabled={leaving} onClick={() => { setRole(null); setAdminForm(false); }}
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-brand-700 disabled:opacity-50">
        <span aria-hidden="true" className="transition group-hover:-translate-x-0.5">←</span> Change role
      </button>
      <span className="badge gap-1 bg-brand-50 text-brand-700"><span aria-hidden="true">{r.icon}</span> {r.label}</span>
    </div>
  );

  return (
    <AuthShell top={top} title={r.heading} subtitle={r.blurb}>
      <div key={role} className="animate-slide-up">
        {role === "admin" ? (
          <>
            <ul className="space-y-2.5 rounded-2xl border border-earth-100 bg-earth-50 p-5 text-sm text-gray-700">
              {r.perks.map(([icon, text]) => (
                <li key={text} className="flex items-start gap-3"><span aria-hidden="true">{icon}</span>{text}</li>
              ))}
            </ul>
            <DemoButton role="admin" next={next} label="Open admin dashboard demo" {...flow} className="btn-primary mt-4 w-full py-3" />
            <p className="mt-2.5 text-center text-xs text-gray-500">No sign-up needed. Opens instantly.</p>
            {adminForm ? (
              <div className="mt-6 animate-slide-up border-t border-gray-100 pt-6"><SignInForm to={next || r.home} {...flow} /></div>
            ) : (
              <p className="mt-6 text-center text-sm text-gray-500">
                Have an admin account? <button type="button" onClick={() => setAdminForm(true)} className="font-semibold text-brand-700 hover:underline">Sign in</button>
              </p>
            )}
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-4 sm:p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-900"><span aria-hidden="true">⚡</span> Explore instantly, no sign-up needed</p>
              <DemoButton role={role} next={next} {...flow} />
              <p className="mt-2.5 text-center text-xs text-gray-500">{r.demoBlurb}</p>
            </div>
            <Link href={`/register?role=${role}${query}`} className="btn-outline mt-3 w-full py-3">
              <span aria-hidden="true">✨</span> Create your own {r.label.toLowerCase()} account
            </Link>
            <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
              <div className="h-px flex-1 bg-gray-200" />Already have an account? Sign in<div className="h-px flex-1 bg-gray-200" />
            </div>
            <SignInForm to={next || r.home} {...flow} />
          </>
        )}
      </div>
    </AuthShell>
  );
}

function LoginFromParams() {
  const params = useSearchParams();
  return <Login roleParam={params.get("role")} nextParam={params.get("next")} />;
}

export default function LoginPage() {
  return <Suspense fallback={<Login />}><LoginFromParams /></Suspense>;
}
