import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Your Cart",
  description: "Review the fresh farm products in your Farmora cart before checkout.",
  path: "/cart",
  noindex: true,
});

export default function CartLayout({ children }) {
  return children;
}
