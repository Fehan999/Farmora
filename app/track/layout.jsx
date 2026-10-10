import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Track Your Order",
  description: "Enter your Farmora order ID to follow your delivery live — from the farm, through packing and transit, to your door within 3 days.",
  path: "/track",
});

export default function TrackLayout({ children }) {
  return children;
}
