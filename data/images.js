import { pexels } from "@/lib/images";
import { PHOTOS } from "./photos";

const pick = (key, w = 1200, i = 0) => {
  const ids = PHOTOS[key] || [];
  const id = ids[i] ?? ids[0];
  return id ? pexels(id, w) : "";
};

export const SITE_IMAGES = {
  heroMain: pick("heroMain", 1000),
  heroSecondary: pick("heroSecondary", 800),
  auth: pick("auth", 1400),
  about: pick("about", 1200),
  sell: pick("sell", 1600),
};

export const BLOG_IMAGES = [1, 2, 3, 4, 5, 6].map((n) => pick(`blog${n}`, 800));

export const PAGE_IMAGES = {
  shop: pick("cat:vegetables", 1600),
  categories: pick("cat:fruits", 1600),
  farmers: pick("f1", 1600),
  about: pick("about", 1600),
  contact: pick("f2", 1600),
  faq: pick("f8", 1600),
  track: pick("f6", 1600),
  cart: pick("cat:bakery", 1600),
  checkout: pick("cat:dairy", 1600),
  wishlist: pick("cat:honey", 1600),
  orders: pick("f7", 1600),
  account: pick("f3", 1600),
  blog: pick("blog2", 1600),
  legal: pick("auth", 1600),
  sell: pick("sell", 1600),
  notFound: pick("f7", 1200),
};
