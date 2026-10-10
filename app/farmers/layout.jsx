import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Meet Our Local Farmers",
  description: "Meet the verified family farms behind Farmora — heirloom growers, orchards, dairies, apiaries, bakeries and ranches. Read their stories and buy direct from the source.",
  path: "/farmers",
});

export default function FarmersLayout({ children }) {
  return children;
}
