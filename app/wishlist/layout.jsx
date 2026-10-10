import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "My Wishlist",
  description: "Your saved Farmora products, ready when you are.",
  path: "/wishlist",
  noindex: true,
});

export default function WishlistLayout({ children }) {
  return children;
}
