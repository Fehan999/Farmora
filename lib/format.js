export const money = (n) => `$${Number(n || 0).toFixed(2)}`;
export const date = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const dateTime = (d) => new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const uid = (p = "id") => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
export const SHIPPING_FREE_OVER = 50;
export const SHIPPING_FEE = 4.99;
export const TAX_RATE = 0.05;
export const COUPONS = { FRESH10: 0.1, FARMORA20: 0.2, WELCOME5: 0.05 };
