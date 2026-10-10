export const ROLES = {
  buyer: {
    label: "Customer", icon: "🛍️", title: "I'm a Customer", heading: "Continue as a customer",
    blurb: "Shop fresh produce straight from local farms.",
    demoBlurb: "Browse the shop, fill a cart and track sample orders.",
    home: "/shop", dashboard: "/account",
  },
  farmer: {
    label: "Farmer", icon: "🧑‍🌾", title: "I'm a Farmer", heading: "Continue as a farmer",
    blurb: "Sell your harvest and manage your farm stand.",
    demoBlurb: "Manage products, orders and sales on a working farm stand.",
    home: "/farmer/dashboard", dashboard: "/farmer/dashboard", area: "/farmer",
  },
  admin: {
    label: "Admin", icon: "🛡️", title: "View admin demo", heading: "Admin dashboard demo",
    blurb: "See how the marketplace runs behind the scenes.",
    home: "/admin", dashboard: "/admin", area: "/admin",
    perks: [
      ["💰", "Marketplace revenue and commission earnings"],
      ["📦", "Every order across all farms"],
      ["🧺", "Products, stock and featured listings"],
      ["👥", "Farmers and customers in one place"],
    ],
  },
};

export function normalizeRole(role) {
  if (role === "customer") return "buyer";
  return Object.keys(ROLES).includes(role) ? role : null;
}

export function safeNext(raw) {
  return typeof raw === "string" && /^\/(?![/\\])/.test(raw) ? raw : "";
}

export function destinationFor(role, next) {
  const r = ROLES[normalizeRole(role) || "buyer"];
  if (!next) return r.home;
  return !r.area || next.startsWith(r.area) ? next : r.home;
}

export const dashboardFor = (role) => ROLES[normalizeRole(role) || "buyer"].dashboard;
