import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where,
} from "firebase/firestore";
import { db } from "./firebase";
import { PRODUCTS, FARMERS, BUYERS, seedOrders } from "@/data/seed";
import { uid } from "./format";

const withTimeout = (p, ms = 6000) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

const local = {
  get(key, fallback = []) {
    if (typeof window === "undefined") return fallback;
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
  },
};

async function readCollection(name, constraints = []) {
  try {
    const ref = constraints.length ? query(collection(db, name), ...constraints) : collection(db, name);
    const snap = await withTimeout(getDocs(ref));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

function mergeById(...lists) {
  const map = new Map();
  lists.flat().forEach((x) => map.set(x.id, { ...map.get(x.id), ...x }));
  return [...map.values()];
}

/* ---------- Products ---------- */

export async function getProducts({ includeHidden = false } = {}) {
  const remote = await readCollection("products");
  const localItems = local.get("farmora_products");
  const overrides = local.get("farmora_product_overrides", {});
  const removed = local.get("farmora_removed_products");
  let all = mergeById(PRODUCTS, localItems, remote)
    .filter((p) => !removed.includes(p.id) && !p.deleted)
    .map((p) => ({ ...p, ...(overrides[p.id] || {}) }));
  if (!includeHidden) all = all.filter((p) => p.status !== "rejected" && p.status !== "hidden");
  return all;
}

export async function getProduct(id) {
  const all = await getProducts({ includeHidden: true });
  return all.find((p) => p.id === id) || null;
}

export async function saveProduct(product) {
  const item = { ...product, id: product.id || uid("prd"), updatedAt: new Date().toISOString() };
  if (!item.createdAt) item.createdAt = item.updatedAt;
  const list = local.get("farmora_products").filter((p) => p.id !== item.id);
  local.set("farmora_products", [item, ...list]);
  try { await withTimeout(setDoc(doc(db, "products", item.id), item, { merge: true })); } catch {}
  return item;
}

export async function patchProduct(id, patch) {
  const overrides = local.get("farmora_product_overrides", {});
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  local.set("farmora_product_overrides", overrides);
  try { await withTimeout(updateDoc(doc(db, "products", id), patch)); } catch {}
}

export async function removeProduct(id) {
  local.set("farmora_removed_products", [...new Set([...local.get("farmora_removed_products"), id])]);
  local.set("farmora_products", local.get("farmora_products").filter((p) => p.id !== id));
  try { await withTimeout(deleteDoc(doc(db, "products", id))); } catch {}
}

/* ---------- Farmers & users ---------- */

export async function getFarmers() {
  const remote = (await readCollection("users", [where("role", "==", "farmer")])).map((u) => ({
    id: u.farmerId || u.id,
    name: u.farmName || `${u.name}'s Farm`,
    owner: u.name,
    email: u.email,
    phone: u.phone || "",
    location: u.location || "United States",
    since: new Date(u.createdAt || Date.now()).getFullYear(),
    acres: u.acres || 10,
    rating: 5,
    reviews: 0,
    verified: false,
    avatar: u.avatar || `https://i.pravatar.cc/200?u=${u.id}`,
    cover: "https://loremflickr.com/1200/400/farm?lock=99",
    specialty: u.specialty || "Fresh local produce",
    bio: u.bio || "A new farm on Farmora.",
    certifications: [],
    joined: u.createdAt,
  }));
  return mergeById(FARMERS, remote);
}

export async function getFarmer(id) {
  return (await getFarmers()).find((f) => f.id === id) || null;
}

export async function getUserProfile(id) {
  try {
    const snap = await withTimeout(getDoc(doc(db, "users", id)));
    if (snap.exists()) return { id, ...snap.data() };
  } catch {}
  return local.get("farmora_profiles", {})[id] || null;
}

export async function saveUserProfile(id, data) {
  const profiles = local.get("farmora_profiles", {});
  profiles[id] = { ...(profiles[id] || {}), ...data, id };
  local.set("farmora_profiles", profiles);
  try { await withTimeout(setDoc(doc(db, "users", id), data, { merge: true })); } catch {}
  return profiles[id];
}

export async function getAllUsers() {
  const remote = await readCollection("users");
  const localProfiles = Object.values(local.get("farmora_profiles", {}));
  const statusOverrides = local.get("farmora_user_status", {});
  const seeded = [
    ...BUYERS.map((b) => ({ ...b, role: "buyer", createdAt: b.joined })),
    ...FARMERS.map((f) => ({ id: f.id, name: f.owner, email: f.email, phone: f.phone, location: f.location, avatar: f.avatar, role: "farmer", farmName: f.name, createdAt: f.joined, status: "active" })),
  ];
  return mergeById(seeded, localProfiles, remote).map((u) => ({
    status: "active", ...u, ...(statusOverrides[u.id] ? { status: statusOverrides[u.id] } : {}),
  }));
}

export async function setUserStatus(id, status) {
  const map = local.get("farmora_user_status", {});
  map[id] = status;
  local.set("farmora_user_status", map);
  try { await withTimeout(updateDoc(doc(db, "users", id), { status })); } catch {}
}

/* ---------- Orders ---------- */

export async function createOrder(order) {
  const item = { ...order, id: `ORD-${Date.now().toString().slice(-7)}`, createdAt: new Date().toISOString(), status: "placed" };
  local.set("farmora_orders", [item, ...local.get("farmora_orders")]);
  try { await withTimeout(setDoc(doc(db, "orders", item.id), item)); } catch {}
  return item;
}

export async function getAllOrders() {
  const remote = await readCollection("orders");
  const overrides = local.get("farmora_order_overrides", {});
  return mergeById(seedOrders(), local.get("farmora_orders"), remote)
    .map((o) => ({ ...o, ...(overrides[o.id] || {}) }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getOrder(id) {
  return (await getAllOrders()).find((o) => o.id === id) || null;
}

export async function getOrdersForBuyer(buyerId) {
  return (await getAllOrders()).filter((o) => o.buyerId === buyerId);
}

export async function getOrdersForFarmer(farmerId) {
  return (await getAllOrders()).filter((o) => (o.farmerIds || []).includes(farmerId));
}

export async function updateOrder(id, patch) {
  const overrides = local.get("farmora_order_overrides", {});
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  local.set("farmora_order_overrides", overrides);
  try { await withTimeout(updateDoc(doc(db, "orders", id), patch)); } catch {}
}

/* ---------- Reviews ---------- */

export async function getProductReviews(productId) {
  const remote = await readCollection("reviews", [where("productId", "==", productId)]);
  const localReviews = local.get("farmora_reviews").filter((r) => r.productId === productId);
  return mergeById(localReviews, remote).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addReview(review) {
  const item = { ...review, id: uid("rev"), createdAt: new Date().toISOString() };
  local.set("farmora_reviews", [item, ...local.get("farmora_reviews")]);
  try { await withTimeout(setDoc(doc(db, "reviews", item.id), item)); } catch {}
  return item;
}

/* ---------- Messages & newsletter ---------- */

export async function sendContactMessage(msg) {
  const item = { ...msg, id: uid("msg"), createdAt: new Date().toISOString() };
  local.set("farmora_messages", [item, ...local.get("farmora_messages")]);
  try { await withTimeout(setDoc(doc(db, "messages", item.id), item)); } catch {}
  return item;
}

export async function getMessages() {
  const remote = await readCollection("messages");
  return mergeById(local.get("farmora_messages"), remote).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function subscribeNewsletter(email) {
  local.set("farmora_newsletter", [...new Set([...local.get("farmora_newsletter"), email])]);
  try { await withTimeout(setDoc(doc(db, "newsletter", email), { email, createdAt: new Date().toISOString() })); } catch {}
}
