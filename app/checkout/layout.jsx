import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Checkout",
  description: "Securely complete your Farmora order and schedule 3-day farm-to-door delivery.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutLayout({ children }) {
  return children;
}
