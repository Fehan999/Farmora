import { getDb } from "./firebase";
import { PRODUCTS, FARMERS, BUYERS, seedOrders } from "@/data/seed";
import { uid } from "./format";

const isBrowser = typeof window !== "undefined";
const REMOTE_TTL = 60 * 1000;
const STATUS_KEY = "farmora_remote_down";
const CACHE_PREFIX = "farmora_remote_";

const memory = new Map();
const inflight = new Map();
const deniedCollections = new Set();
let remoteDown = false;
let seededOrders;

if (isBrowser) {
  try { remoteDown = sessionStorage.getItem(STATUS_KEY) === "1"; } catch {}
}

const withTimeout = (p, ms = 4000) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error("timeout"), { code: "timeout" })), ms))]);

const local = {
  get(key, fallback = []) {
    if (!isBrowser) return fallback;
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    if (!isBrowser) return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

function notify() {
  if (isBrowser) window.dispatchEvent(new Event("farmora:data"));
}

function markFailure(name, err) {
  const code = err?.code || "";
  if (code === "permission-denied") {
    deniedCollections.add(name);
    return;
  }
  remoteDown = true;
  try { sessionStorage.setItem(STATUS_KEY, "1"); } catch {}
}

function refresh(name) {
  if (!isBrowser || remoteDown || deniedCollections.has(name) || inflight.has(name)) return;
  const job = (async () => {
    try {
      const { db, sdk } = await getDb();
      const snap = await withTimeout(sdk.getDocs(sdk.collection(db, name)));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      memory.set(name, { data, at: Date.now() });
      local.set(CACHE_PREFIX + name, data);
      notify();
    } catch (err) {
      markFailure(name, err);
    } finally {
      inflight.delete(name);
    }
  })();
  inflight.set(name, job);
}

function remote(name) {
  if (!isBrowser) return [];
  let entry = memory.get(name);
  if (!entry) {
    entry = { data: local.get(CACHE_PREFIX + name), at: 0 };
    memory.set(name, entry);
  }
  if (Date.now() - entry.at > REMOTE_TTL) refresh(name);
  return entry.data;
}

function patchRemoteCache(name, id, value) {
  const entry = memory.get(name) || { data: local.get(CACHE_PREFIX + name), at: 0 };
  const data = value === null ? entry.data.filter((x) => x.id !== id) : [...entry.data.filter((x) => x.id !== id), { ...entry.data.find((x) => x.id === id), ...value, id }];
  memory.set(name, { ...entry, data });
  local.set(CACHE_PREFIX + name, data);
}

function write(name, id, op, value) {
  if (!isBrowser || remoteDown || deniedCollections.has(name)) return;
  (async () => {
    try {
      const { db, sdk } = await getDb();
      const ref = sdk.doc(db, name, id);
      if (op === "set") await withTimeout(sdk.setDoc(ref, value, { merge: true }));
      if (op === "update") await withTimeout(sdk.setDoc(ref, value, { merge: true }));
      if (op === "delete") await withTimeout(sdk.deleteDoc(ref));
      patchRemoteCache(name, id, op === "delete" ? null : value);
    } catch (err) {
      markFailure(name, err);
    }
  })();
}

function mergeById(...lists) {
  const map = new Map();
  lists.flat().forEach((x) => x && x.id && map.set(x.id, { ...map.get(x.id), ...x }));
  return [...map.values()];
}

export function prefetchRemote() {
  ["products", "users", "orders"].forEach((name) => remote(name));
}

export async function getProducts({ includeHidden = false } = {}) {
  const overrides = local.get("farmora_product_overrides", {});
  const removed = local.get("farmora_removed_products");
  let all = mergeById(PRODUCTS, remote("products"), local.get("farmora_products"))
    .filter((p) => !removed.includes(p.id) && !p.deleted)
    .map((p) => ({ ...p, ...(overrides[p.id] || {}) }));
  if (!includeHidden) all = all.filter((p) => p.status !== "rejected" && p.status !== "hidden");
  return all;
}

export async function getProduct(id) {
  return (await getProducts({ includeHidden: true })).find((p) => p.id === id) || null;
}

export async function saveProduct(product) {
  const item = { ...product, id: product.id || uid("prd"), updatedAt: new Date().toISOString() };
  if (!item.createdAt) item.createdAt = item.updatedAt;
  local.set("farmora_products", [item, ...local.get("farmora_products").filter((p) => p.id !== item.id)]);
  write("products", item.id, "set", item);
  notify();
  return item;
}

export async function patchProduct(id, patch) {
  const overrides = local.get("farmora_product_overrides", {});
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  local.set("farmora_product_overrides", overrides);
  write("products", id, "update", patch);
  notify();
}

export async function removeProduct(id) {
  local.set("farmora_removed_products", [...new Set([...local.get("farmora_removed_products"), id])]);
  local.set("farmora_products", local.get("farmora_products").filter((p) => p.id !== id));
  write("products", id, "delete");
  notify();
}

const isDemoId = (id) => typeof id === "string" && id.startsWith("demo-");

function localProfiles() {
  return Object.values(local.get("farmora_profiles", {})).filter((u) => u && !isDemoId(u.id));
}

function toFarmer(u) {
  return {
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
    avatar: u.avatar || "",
    cover: FARMERS[0].cover,
    specialty: u.specialty || "Fresh local produce",
    bio: u.bio || "A new farm on Farmora.",
    certifications: [],
    joined: u.createdAt,
  };
}

function userFarmers() {
  const seedIds = new Set(FARMERS.map((f) => f.id));
  return mergeById(remote("users").filter((u) => !isDemoId(u.id)), localProfiles())
    .filter((u) => u.role === "farmer")
    .map(toFarmer)
    .filter((f) => !seedIds.has(f.id));
}

export async function getFarmers() {
  return mergeById(FARMERS, userFarmers());
}

export async function getFarmer(id) {
  return (await getFarmers()).find((f) => f.id === id) || null;
}

export function getCachedProfile(id) {
  return local.get("farmora_profiles", {})[id] || null;
}

export async function fetchRemoteProfile(id) {
  if (!isBrowser || remoteDown || deniedCollections.has("users")) return null;
  try {
    const { db, sdk } = await getDb();
    const snap = await withTimeout(sdk.getDoc(sdk.doc(db, "users", id)));
    if (!snap.exists()) return null;
    const profile = { id, ...snap.data() };
    const profiles = local.get("farmora_profiles", {});
    profiles[id] = { ...(profiles[id] || {}), ...profile };
    local.set("farmora_profiles", profiles);
    return profiles[id];
  } catch (err) {
    markFailure("users", err);
    return null;
  }
}

export async function saveUserProfile(id, data) {
  const profiles = local.get("farmora_profiles", {});
  profiles[id] = { ...(profiles[id] || {}), ...data, id };
  local.set("farmora_profiles", profiles);
  write("users", id, "set", data);
  return profiles[id];
}

export async function getAllUsers() {
  const statusOverrides = local.get("farmora_user_status", {});
  const seeded = [
    ...BUYERS.map((b) => ({ ...b, role: "buyer", createdAt: b.joined })),
    ...FARMERS.map((f) => ({ id: f.id, name: f.owner, email: f.email, phone: f.phone, location: f.location, avatar: f.avatar, role: "farmer", farmName: f.name, createdAt: f.joined, status: "active" })),
  ];
  return mergeById(seeded, remote("users").filter((u) => !isDemoId(u.id)), localProfiles()).map((u) => ({
    status: "active", ...u, ...(statusOverrides[u.id] ? { status: statusOverrides[u.id] } : {}),
  }));
}

export async function setUserStatus(id, status) {
  const map = local.get("farmora_user_status", {});
  map[id] = status;
  local.set("farmora_user_status", map);
  write("users", id, "update", { status });
  notify();
}

function getSeedOrders() {
  if (!seededOrders) seededOrders = seedOrders();
  return seededOrders;
}

export async function createOrder(order) {
  const item = { ...order, id: `ORD-${Date.now().toString().slice(-7)}`, createdAt: new Date().toISOString(), status: "placed" };
  local.set("farmora_orders", [item, ...local.get("farmora_orders")]);
  write("orders", item.id, "set", item);
  notify();
  return item;
}

export async function getAllOrders() {
  const overrides = local.get("farmora_order_overrides", {});
  return mergeById(getSeedOrders(), remote("orders"), local.get("farmora_orders"))
    .map((o) => ({ ...o, ...(overrides[o.id] || {}) }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getOrder(id) {
  return (await getAllOrders()).find((o) => o.id === id) || null;
}

export function buyerIdsFor(uid) {
  return uid === "demo-buyer" ? [uid, "b1"] : [uid];
}

export function ownsOrder(user, order) {
  if (!user || !order) return false;
  if (buyerIdsFor(user.uid).includes(order.buyerId)) return true;
  return user.role === "farmer" && !!user.farmerId && (order.farmerIds || []).includes(user.farmerId);
}

export async function getOrdersForBuyer(buyerId) {
  const ids = buyerIdsFor(buyerId);
  return (await getAllOrders()).filter((o) => ids.includes(o.buyerId));
}

export async function getOrdersForFarmer(farmerId) {
  return (await getAllOrders()).filter((o) => (o.farmerIds || []).includes(farmerId));
}

export async function updateOrder(id, patch) {
  const overrides = local.get("farmora_order_overrides", {});
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  local.set("farmora_order_overrides", overrides);
  write("orders", id, "update", patch);
  notify();
}

export async function getProductReviews(productId) {
  return mergeById(remote("reviews"), local.get("farmora_reviews"))
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addReview(review) {
  const item = { ...review, id: uid("rev"), createdAt: new Date().toISOString() };
  local.set("farmora_reviews", [item, ...local.get("farmora_reviews")]);
  write("reviews", item.id, "set", item);
  return item;
}

export async function sendContactMessage(msg) {
  const item = { ...msg, id: uid("msg"), createdAt: new Date().toISOString() };
  local.set("farmora_messages", [item, ...local.get("farmora_messages")]);
  write("messages", item.id, "set", item);
  return item;
}

export async function getMessages() {
  return mergeById(remote("messages"), local.get("farmora_messages")).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function subscribeNewsletter(email) {
  local.set("farmora_newsletter", [...new Set([...local.get("farmora_newsletter"), email])]);
  write("newsletter", email, "set", { email, createdAt: new Date().toISOString() });
}
