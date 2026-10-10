import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Reset Your Password",
  description: "Reset the password for your Farmora account.",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordLayout({ children }) {
  return children;
}
