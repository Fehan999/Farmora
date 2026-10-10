import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Shop by Category",
  description: "Explore Farmora by category: vegetables, fruits, dairy & eggs, bakery, honey & jams, meat & poultry, grains & pulses and herbs & spices — all sourced from local farms.",
  path: "/categories",
});

export default function CategoriesLayout({ children }) {
  return children;
}
