import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "My Orders",
  description: "View your Farmora orders and follow each delivery live.",
  path: "/orders",
  noindex: true,
});

export default function OrdersLayout({ children }) {
  return children;
}
