import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Log In",
  description: "Log in to Farmora as a customer or farmer, or explore instantly with a demo customer, farmer or admin account. A farm-to-table marketplace by Ehan Siddique.",
  path: "/login",
});

export default function LoginLayout({ children }) {
  return children;
}
