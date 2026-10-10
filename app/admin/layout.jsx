import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Admin Dashboard",
  description: "Farmora admin dashboard for managing farmers, buyers, products and commission revenue.",
  path: "/admin",
  noindex: true,
});

export default function AdminLayout({ children }) {
  return children;
}
