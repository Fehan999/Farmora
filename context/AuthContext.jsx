"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile, sendPasswordResetEmail,
} from "firebase/auth";
import { auth, initAnalytics } from "@/lib/firebase";
import { getUserProfile, saveUserProfile } from "@/lib/db";
import { DEMO_ACCOUNTS } from "@/data/seed";

const AuthContext = createContext(null);
const DEMO_KEY = "farmora_demo_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAnalytics().catch(() => {});
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = (await getUserProfile(fbUser.uid)) || {};
        const demo = Object.values(DEMO_ACCOUNTS).find((d) => d.email === fbUser.email);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          name: profile.name || fbUser.displayName || fbUser.email.split("@")[0],
          role: demo?.role || profile.role || "buyer",
          farmerId: demo?.farmerId || profile.farmerId || fbUser.uid,
          ...profile,
          id: fbUser.uid,
        });
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem(DEMO_KEY));
          setUser(saved || null);
        } catch { setUser(null); }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register({ name, email, password, role, farmName, location, phone }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const profile = {
      name, email, role, phone: phone || "", location: location || "",
      farmName: role === "farmer" ? farmName || `${name}'s Farm` : "",
      farmerId: cred.user.uid, status: "active", createdAt: new Date().toISOString(),
    };
    await saveUserProfile(cred.user.uid, profile);
    setUser({ uid: cred.user.uid, id: cred.user.uid, ...profile });
  }

  async function demoLogin(role) {
    const acc = DEMO_ACCOUNTS[role];
    try {
      await signInWithEmailAndPassword(auth, acc.email, acc.password);
      return;
    } catch {
      try {
        const cred = await createUserWithEmailAndPassword(auth, acc.email, acc.password);
        await updateProfile(cred.user, { displayName: acc.name });
        await saveUserProfile(cred.user.uid, {
          name: acc.name, email: acc.email, role: acc.role, farmerId: acc.farmerId || cred.user.uid,
          status: "active", createdAt: new Date().toISOString(),
        });
        return;
      } catch {}
    }
    const session = { uid: `demo-${role}`, id: `demo-${role}`, email: acc.email, name: acc.name, role: acc.role, farmerId: acc.farmerId || `demo-${role}`, demo: true };
    localStorage.setItem(DEMO_KEY, JSON.stringify(session));
    setUser(session);
  }

  async function logout() {
    localStorage.removeItem(DEMO_KEY);
    try { await signOut(auth); } catch {}
    setUser(null);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function updateUser(data) {
    if (!user) return;
    await saveUserProfile(user.uid, data);
    const next = { ...user, ...data };
    if (user.demo) localStorage.setItem(DEMO_KEY, JSON.stringify(next));
    setUser(next);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, resetPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
