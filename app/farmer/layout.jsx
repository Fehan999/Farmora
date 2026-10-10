import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Farmer Dashboard",
  description: "Farmora farmer dashboard for managing products, orders and sales.",
  path: "/farmer/dashboard",
  noindex: true,
});

export default function FarmerLayout({ children }) {
  return children;
}
