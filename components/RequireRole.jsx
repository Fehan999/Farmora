"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";

export default function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container-x grid min-h-[50vh] place-items-center py-24"><Spinner size={48} label="Checking your account..." /></div>;
  if (!user || (roles && !roles.includes(user.role))) {
    return (
      <div className="container-x py-24 text-center">
        <div className="text-6xl">🔒</div>
        <h1 className="mt-4 text-2xl font-bold">Access restricted</h1>
        <p className="mt-2 text-gray-500">{user ? `This area is for ${roles.join(" / ")} accounts only.` : "Please sign in to continue."}</p>
        <Link href="/login" className="btn-primary mt-6">Go to sign in</Link>
      </div>
    );
  }
  return children;
}
