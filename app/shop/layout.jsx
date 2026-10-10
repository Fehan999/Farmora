import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Shop Fresh Local Produce",
  description: "Shop 40+ fresh, organic products — vegetables, fruit, dairy, bakery, honey, meat, grains and herbs — straight from verified local farms, with transparent prices and 3-day delivery.",
  path: "/shop",
});

export default function ShopLayout({ children }) {
  return children;
}
