import { FARMERS, PRODUCTS } from "@/data/seed";
import { BLOG_POSTS } from "@/data/blog";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = [
  ["/", 1, "daily"],
  ["/shop", 0.9, "daily"],
  ["/categories", 0.8, "weekly"],
  ["/farmers", 0.8, "weekly"],
  ["/about", 0.7, "monthly"],
  ["/sell", 0.7, "monthly"],
  ["/blog", 0.6, "weekly"],
  ["/faq", 0.5, "monthly"],
  ["/contact", 0.5, "yearly"],
  ["/track", 0.4, "monthly"],
  ["/login", 0.3, "yearly"],
  ["/register", 0.3, "yearly"],
  ["/shipping", 0.3, "yearly"],
  ["/terms", 0.2, "yearly"],
  ["/privacy", 0.2, "yearly"],
];

export default function sitemap() {
  const lastModified = new Date();
  const entry = (path, priority, changeFrequency) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority });
  return [
    ...STATIC_ROUTES.map(([path, priority, freq]) => entry(path, priority, freq)),
    ...PRODUCTS.map((p) => entry(`/product/${p.id}`, p.featured ? 0.8 : 0.7, "weekly")),
    ...FARMERS.map((f) => entry(`/farmers/${f.id}`, 0.6, "weekly")),
    ...BLOG_POSTS.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(`${p.date}T09:00:00.000Z`), changeFrequency: "monthly", priority: 0.5 })),
  ];
}
