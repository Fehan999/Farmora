import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "My Account",
  description: "Manage your Farmora profile, addresses and account settings.",
  path: "/account",
  noindex: true,
});

export default function AccountLayout({ children }) {
  return children;
}
