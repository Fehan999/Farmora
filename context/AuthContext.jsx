"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAuthClient, initAnalytics } from "@/lib/firebase";
import { getCachedProfile, fetchRemoteProfile, saveUserProfile, prefetchRemote } from "@/lib/db";
import { DEMO_ACCOUNTS } from "@/data/seed";

const AuthContext = createContext(null);
const SESSION_KEY = "farmora_session";
const AUTH_TIMEOUT = 5000;

const timeout = (p, ms = AUTH_TIMEOUT) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error("Request timed out. Please try again."), { code: "timeout" })), ms))]);

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

function writeSession(user) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}

function buildUser(fbUser, profile = {}) {
  const demo = Object.values(DEMO_ACCOUNTS).find((d) => d.email === fbUser.email);
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    name: profile.name || fbUser.displayName || demo?.name || fbUser.email.split("@")[0],
    farmerId: demo?.farmerId || profile.farmerId || fbUser.uid,
    ...profile,
    role: demo?.role || profile.role || "buyer",
    id: fbUser.uid,
  };
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);
  const ignoreFirebase = useRef(false);

  function setUser(next) {
    userRef.current = next;
    setUserState(next);
    writeSession(next);
  }

  useEffect(() => {
    const cached = readSession();
    if (cached) { userRef.current = cached; setUserState(cached); ignoreFirebase.current = !!cached.demo; }
    setLoading(false);

    let unsub = () => {};
    let cancelled = false;
    const start = () => {
      prefetchRemote();
      initAnalytics().catch(() => {});
      getAuthClient().then(({ auth, sdk }) => {
        if (cancelled) return;
        unsub = sdk.onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            if (ignoreFirebase.current) { sdk.signOut(auth).catch(() => {}); return; }
            const base = buildUser(fbUser, getCachedProfile(fbUser.uid) || {});
            setUser(base);
            const remoteProfile = await fetchRemoteProfile(fbUser.uid);
            if (remoteProfile && userRef.current?.uid === fbUser.uid) setUser(buildUser(fbUser, remoteProfile));
          } else if (userRef.current && !userRef.current.demo) {
            setUser(null);
          }
        });
      }).catch(() => {});
    };
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    idle(start);
    return () => { cancelled = true; unsub(); };
  }, []);

  async function login(email, password) {
    ignoreFirebase.current = false;
    const { auth, sdk } = await getAuthClient();
    await timeout(sdk.signInWithEmailAndPassword(auth, email, password));
  }

  async function register({ name, email, password, role, farmName, location, phone }) {
    ignoreFirebase.current = false;
    const { auth, sdk } = await getAuthClient();
    const cred = await timeout(sdk.createUserWithEmailAndPassword(auth, email, password));
    const profile = {
      name, email, role, phone: phone || "", location: location || "",
      farmName: role === "farmer" ? farmName || `${name}'s Farm` : "",
      farmerId: cred.user.uid, status: "active", createdAt: new Date().toISOString(),
    };
    await saveUserProfile(cred.user.uid, profile);
    setUser(buildUser(cred.user, profile));
    sdk.updateProfile(cred.user, { displayName: name }).catch(() => {});
  }

  async function demoLogin(role) {
    const acc = DEMO_ACCOUNTS[role];
    const session = {
      uid: `demo-${role}`, id: `demo-${role}`, email: acc.email, name: acc.name,
      role: acc.role, farmerId: acc.farmerId || `demo-${role}`, demo: true,
    };
    ignoreFirebase.current = true;
    setUser(session);
    getAuthClient().then(({ auth, sdk }) => {
      if (auth.currentUser && ignoreFirebase.current) return sdk.signOut(auth);
    }).catch(() => {});
    return session;
  }

  async function logout() {
    ignoreFirebase.current = false;
    setUser(null);
    try {
      const { auth, sdk } = await getAuthClient();
      await sdk.signOut(auth);
    } catch {}
  }

  async function resetPassword(email) {
    const { auth, sdk } = await getAuthClient();
    await timeout(sdk.sendPasswordResetEmail(auth, email));
  }

  async function updateUser(data) {
    const current = userRef.current;
    if (!current) return;
    const next = { ...current, ...data };
    if (!current.demo) {
      await saveUserProfile(current.uid, {
        name: current.name, email: current.email, role: current.role,
        ...(current.farmerId ? { farmerId: current.farmerId } : {}),
        ...data,
      });
    }
    setUser(next);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, resetPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
